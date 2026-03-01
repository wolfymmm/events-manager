export interface CreateEventDto {
  title: string;
  description: string;
  date: Date;
  location: string;
  capacity: number;
  isPublic?: boolean;
}

export interface UpdateEventDto extends Partial<CreateEventDto> {}