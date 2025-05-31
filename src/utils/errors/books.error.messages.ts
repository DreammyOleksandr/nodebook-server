export class BooksErrorMessages {
  public INVALID_ID = 'Invalid ID format' as const
  public NOT_FOUND = (id: string) => `Book with ID ${id} not found` as const
  public EXISTS = 'A book with this name already exists' as const
  public INVALID_RATING = 'Rating must be between 1 and 5' as const
  public ALREADY_LIKED = 'You have already liked this book' as const
  public NOT_LIKED = 'You have not liked this book yet' as const
}
