import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import server from '../../../server/server'
import connection from '../../../server/db/connection'
import { createUser, getUserById } from '../../../server/db/users'

const user = {
  user_id: 'u_test01',
  user_name: 'test_owner',
  email: 'owner@example.com',
  postcode: '1010',
  about: null,
  interests: ['science fiction', 'classics'],
  status: 'ACTIVE' as const,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_deleted: false,
  deleted_at: null,
}

describe('MVP API contracts', () => {
  beforeAll(async () => {
    await connection.migrate.latest()
    await createUser(user)
    await createUser({
      ...user,
      user_id: 'u_test02',
      user_name: 'test_borrower',
      email: 'borrower@example.com',
    })
  })

  afterAll(async () => {
    await connection.destroy()
  })

  it('serializes signup interests and maps them back to an array', async () => {
    const stored = await connection('user').where({ user_id: user.user_id }).first()
    const mapped = await getUserById(user.user_id)

    expect(stored.interests).toBe('science fiction,classics')
    expect(mapped?.interests).toEqual(['science fiction', 'classics'])
  })

  it('assigns book ownership from the authenticated user and ignores spoofed ownership', async () => {
    const response = await request(server)
      .post('/api/v1/books/add')
      .set('x-test-user-id', user.user_id)
      .send({
        owner_id: 'u_test02',
        title: 'Owned by the requestor',
        creator: 'A Writer',
        work_id: 'work_test',
        format: 'Paperback',
        status: 'Available',
        image: '',
      })

    expect(response.status).toBe(201)
    expect(response.body.book_id).toMatch(/^bk_/)
    expect(response.body.owner_id).toBe(user.user_id)

    const ownedBooks = await request(server).get(
      `/api/v1/books/owner/${user.user_id}`,
    )
    expect(ownedBooks.status).toBe(200)
    expect(ownedBooks.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          book_id: response.body.book_id,
          owner_id: user.user_id,
        }),
      ]),
    )
  })

  it('rejects protected mutations without an authenticated user', async () => {
    const response = await request(server).post('/api/v1/books/add').send({
      title: 'Unauthenticated book',
      creator: 'Unknown',
    })

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Authentication required')
  })

  it('returns the private current profile only to its authenticated user', async () => {
    const current = await request(server)
      .get('/api/v1/users/me')
      .set('x-test-user-id', user.user_id)

    expect(current.status).toBe(200)
    expect(current.body.email).toBe(user.email)

    const publicResponse = await request(server).get(
      `/api/v1/users/${user.user_id}`,
    )
    expect(publicResponse.status).toBe(200)
    expect(publicResponse.body.email).toBeUndefined()
    expect(publicResponse.body.postcode).toBeUndefined()
  })

  it('creates a pending loan request for an authenticated borrower', async () => {
    const book = await request(server)
      .post('/api/v1/books/add')
      .set('x-test-user-id', user.user_id)
      .send({
        title: 'Borrowable Contract Book',
        creator: 'Loan Writer',
        work_id: 'work_loan_contract',
        format: 'Paperback',
        status: 'Available',
        image: '',
      })

    const created = await request(server)
      .post('/api/v1/loans/add')
      .set('x-test-user-id', 'u_test02')
      .send({
        book_id: book.body.book_id,
      })

    expect(created.status).toBe(201)
    expect(created.body.owner_id).toBe(user.user_id)
    expect(created.body.borrower_id).toBe('u_test02')
    expect(created.body.status).toBe('Pending')

    const search = await request(server)
      .get('/api/v1/loans/search')
      .set('x-test-user-id', 'u_test02')
      .query({ query: 'Borrowable' })
    expect(search.status).toBe(200)
    expect(search.body).toHaveLength(1)
    expect(search.body[0]).toEqual(
      expect.objectContaining({
        book_title: 'Borrowable Contract Book',
        owner_name: user.user_name,
      }),
    )
  })

  it('ignores spoofed owner and borrower IDs on loan creation', async () => {
    const book = await request(server)
      .post('/api/v1/books/add')
      .set('x-test-user-id', user.user_id)
      .send({
        title: 'Spoof Resistant Loan Book',
        creator: 'Loan Writer',
        work_id: 'work_spoof_contract',
        format: 'Paperback',
        status: 'Available',
        image: '',
      })

    const created = await request(server)
      .post('/api/v1/loans/add')
      .set('x-test-user-id', 'u_test02')
      .send({
        book_id: book.body.book_id,
        owner_id: 'u_test02',
        borrower_id: user.user_id,
        status: 'Active',
      })

    expect(created.status).toBe(201)
    expect(created.body.owner_id).toBe(user.user_id)
    expect(created.body.borrower_id).toBe('u_test02')
    expect(created.body.status).toBe('Pending')
  })

  it('rejects unauthenticated loan creation', async () => {
    const response = await request(server).post('/api/v1/loans/add').send({
      book_id: 'bk_missing',
    })

    expect(response.status).toBe(401)
    expect(response.body.error).toBe('Authentication required')
  })

  it('keeps loan status updates owner-only', async () => {
    const book = await request(server)
      .post('/api/v1/books/add')
      .set('x-test-user-id', user.user_id)
      .send({
        title: 'Owner Update Loan Book',
        creator: 'Loan Writer',
        work_id: 'work_update_contract',
        format: 'Paperback',
        status: 'Available',
        image: '',
      })

    const created = await request(server)
      .post('/api/v1/loans/add')
      .set('x-test-user-id', 'u_test02')
      .send({
        book_id: book.body.book_id,
      })

    const denied = await request(server)
      .patch(`/api/v1/loans/${created.body.loan_id}`)
      .set('x-test-user-id', 'u_test02')
      .send({ status: 'Active' })
    expect(denied.status).toBe(403)

    const updated = await request(server)
      .patch(`/api/v1/loans/${created.body.loan_id}`)
      .set('x-test-user-id', user.user_id)
      .send({ status: 'Active' })
    expect(updated.status).toBe(200)
    expect(updated.body.status).toBe('Active')
  })
})
