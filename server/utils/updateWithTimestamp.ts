import connection from "../db/connection";

export const updateWithTimestamp = async (table: string, id: string, data: object) => {
  return await connection(table)
    .where({ id })
    .update({
      ...data,
      updated_at: connection.fn.now() 
    });
};