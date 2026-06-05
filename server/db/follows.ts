import connection from './connection'
import { Follow } from '../../models/follows'


export async function getFollowsByUser(userId: string) {
  return await connection('follows')
    .where({ follower_id: userId })
    .select('*');
}


// Create follow
export async function createFollow(newFollow: any): Promise<Follow> {
  const newFollow = {
    follower_id,
    followed_id
  };
  const [createdFollow] = await connection('follows')
    .insert(newFollow)
    .returning('*');
  return createdFollow;
}


// Delete follow
export async function deleteFollow(id: string): Promise<void> {
  return await connection('follows')
   .where({ follower_id: followerId, followed_id: followedId })
   .del();
}


//Admin access to view complete follows history (could limit).
export async function getAllFollows(userId: string) {
  const follows = await connection('follows')
    .where({ followed_id: userId })
    .orWhere({ follower_id: userId })
  return follows
}
