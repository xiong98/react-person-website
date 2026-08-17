import { useState } from 'react'
import { useForm, type Resolver } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2, '至少 2 个字符'),
  email: z.string().email('邮箱格式不正确'),
})

type FormValues = z.infer<typeof schema>

type FieldErrors = Partial<Record<keyof FormValues, { type: string; message: string }>>

const zodResolver: Resolver<FormValues> = (values) => {
  const result = schema.safeParse(values)
  if (result.success) {
    return { values: result.data, errors: {} }
  }
  const errors: FieldErrors = {}
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? 'root') as keyof FormValues
    if (!errors[key]) {
      errors[key] = { type: 'manual', message: issue.message }
    }
  }
  return { values: {} as FormValues, errors: errors as never }
}

export function DemoForm() {
  const [submitted, setSubmitted] = useState<FormValues | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver })

  return (
    <div>
      <h3 className="mb-2 font-semibold text-cyan-300">react-hook-form + zod</h3>
      <form
        className="space-y-2"
        onSubmit={handleSubmit((values) => setSubmitted(values))}
      >
        <div>
          <input
            className="rounded border border-slate-600 bg-slate-800 px-2 py-1"
            placeholder="姓名"
            {...register('name')}
          />
          {errors.name && <p className="text-xs text-rose-400">{errors.name.message}</p>}
        </div>
        <div>
          <input
            className="rounded border border-slate-600 bg-slate-800 px-2 py-1"
            placeholder="邮箱"
            {...register('email')}
          />
          {errors.email && <p className="text-xs text-rose-400">{errors.email.message}</p>}
        </div>
        <button
          type="submit"
          className="rounded bg-cyan-600 px-3 py-1 text-sm hover:bg-cyan-500"
        >
          提交
        </button>
      </form>
      {submitted && (
        <pre className="mt-2 text-xs text-emerald-300">
          {JSON.stringify(submitted, null, 2)}
        </pre>
      )}
    </div>
  )
}
