import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod/v4'
import { useCreateRoom } from '@/http/use-create-room'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form'
import { Textarea } from './ui/textarea'
import { Input } from './ui/input'

const createRoomSchema = z.object({
  name: z.string().min(3, { message: 'Inclua no mínimo 3 caracteres' }),
  description: z.string(),
})

// // -> Transforma JS em TS para validação
// The `z.infer<typeof createRoomSchema>` syntax is a TypeScript type utility
// that extracts the type of the data that the `createRoomSchema` validates.
// In this case, it's equivalent to writing out the type explicitly as:
//   {
//     name: string;
//     description: string;
//   }
//
// The `z.infer` utility is useful when you want to define a type that is
// based on the shape of a schema, without having to manually repeat the
// same structure.
type CreateRoomFormData = z.infer<typeof createRoomSchema>

/**
 * Render a form to create a new room. The form includes fields for the room's
 * name and description, and a button to submit the form and create the room.
 *
 * The form is wrapped in a Card component, which provides a basic layout and
 * styling for the form.
 *
 * The form uses the useForm hook from `react-hook-form` to manage the form's
 * state and validation. The form's data is validated using the `createRoomSchema`
 * Zod schema.
 *
 * When the form is submitted, the `handleCreateRoom` function is called with the
 * form's data. This function creates a new room using the `useCreateRoom` hook,
 * and resets the form after the room is created.
 */
export function CreateRoomForm() {
  // é a função que vai chamar a mutation Function que realiza a chamada HTTP
  // Estou renomeando ela para createRoom
  const { mutateAsync: createRoom } = useCreateRoom()

  const createRoomForm = useForm<CreateRoomFormData>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  })

  
  /**
   * Handle the create room form submission, creating a new room and resetting
   * the form afterwards.
   *
   * @param {CreateRoomFormData} data - The form data, containing the name and
   * description of the room to be created.
   */
  async function handleCreateRoom({ name, description }: CreateRoomFormData) {
    await createRoom({ name, description })

    createRoomForm.reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar sala</CardTitle>
        <CardDescription>
          Crie uma nova sala para começar a fazer perguntas e receber respostas
          da I.A.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Spread operator to receive ao props from the form TAG */}
        <Form {...createRoomForm}>
          <form
            className="flex flex-col gap-4"
            onSubmit={createRoomForm.handleSubmit(handleCreateRoom)}
          >
            <FormField
              control={createRoomForm.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Nome da sala</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Digite o nome da sala..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            <FormField
              control={createRoomForm.control}
              name="description"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )
              }}
            />

            <Button className="w-full" type="submit">
              Criar sala
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}