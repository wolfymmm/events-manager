import * as yup from 'yup';

export type CreateEventDto = yup.InferType<typeof eventSchema>;

export const eventSchema = yup.object().shape({
    title: yup.string().required('Title is required'),
    description: yup.string().required('Description is required'),
    date: yup.date()
        .min(new Date(), "Date must be in the future")
        .required('Date is required'),
    location: yup.string().required('Location is required'),
    capacity: yup.number().integer().positive().required('Capacity is required'),
    isPublic: yup.boolean()
        .default(true)
        .optional(),  
});

export const updateEventSchema = yup.object({
  title: yup.string().optional(),
  description: yup.string().optional(),
  date: yup.string().optional(),
  location: yup.string().optional(),
  capacity: yup.number().optional().positive().integer(),
});