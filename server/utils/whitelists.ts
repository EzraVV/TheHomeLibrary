
export function getBookUpdateFields(body: any) {
  const allowed = ['title', 'creator', 'edition_name', 'isbn', 'format', 'description', 'condition', 'lending_terms', 'status', 'image'];
  const updateData: any = {};
  
  allowed.forEach(key => {
    if (body[key] !== undefined) updateData[key] = body[key];
  });
  
  return updateData;
}