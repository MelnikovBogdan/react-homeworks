import {FormEvent, useEffect, useRef, useState} from "react";

export type Field = {
    name: string
    label: string
    required?: boolean
    placeholder?: string
} & ({
    type: 'text' | 'email' | 'password'
    max?: number
} | {
    type: 'select'
    options: string[]
})

type FormField = {
    value: string | undefined
    type: 'text' | 'email' | 'password' | 'select'
    label: string
    options: string[]
    required?: boolean
    onChange: (value: string | null) => void
}

type Form = Record<string, FormField>

type FormFieldKey<TFields extends Array<Field>> = TFields[number]['name']

function useForm<TFields extends Array<Field>>(fields: TFields, cb: (e: FormEvent) => Promise<void> | void) : {
    form: Form & Record<FormFieldKey<TFields>, FormField>
    isValid: React.MutableRefObject<boolean>
    error: string | undefined
    submit: (e: FormEvent) => void
    clear: () => void
} {
    const [form, setForm] = useState<Form & Record<FormFieldKey<TFields>, FormField>>(getInitialFormState(fields));
    const [error, setError] = useState<string | undefined>()
    const isValid = useRef<boolean>(false)

    function getInitialFormState<TFields extends Array<Field>>(f: TFields) {
        return f.reduce((acc, field) => {
            acc[field.name] = {
                type: field.type,
                label: field.label,
                required: field.required,
                value: field.type === 'select' ? undefined : '',
                options: field.type === 'select' ? field.options : [],
                onChange: (value: string | null) => setValueByFieldName(field.name, (field.type === 'select' ? (value ?? null) : (value ?? '') )),
            };
            return acc;
        }, {} as Form) as Form & Record<FormFieldKey<TFields>, FormField>
    }

    function setValueByFieldName(name: string, value: string | null) {
        setForm(prev => ({ ...prev, [name]: { ...prev[name], value }}))
    }

    function validateRequired(field: FormField): boolean {
        if (field.type === 'text' || field.type === 'email' || field.type === 'password')
            return !!field.value && !!field.value.length
        else
            return !!field.value
    }

    function validate(form: Form, f: Array<Field>): { isValid: boolean, error: string | undefined } {
        for (const field of f) {
            if (field.required && !validateRequired(form[field.name]))  {
                return { isValid: false, error: `Error: form is not valid. Field "${field.name}" is required`}
            }
        }


        return { isValid: true, error: undefined }
    }

    function submit(event: FormEvent) {
        event.preventDefault()

        const { isValid, error: e } = validate(form, fields)

        if (!isValid) {
            setError(e)
            throw new Error('Form is not valid: ' + e)
        }

        setError(undefined)
        cb(event)
    }

    function clear() {
        Object.entries(form).forEach(([key, field]) => {
            if (field.type === 'text' || field.type === 'email' || field.type === 'password')
                setValueByFieldName(key, '')
            else
                setValueByFieldName(key, null)
        })
    }

    useEffect(() => {
        setForm(getInitialFormState(fields))
    }, [ fields ])

    useEffect(() => {
        isValid.current = error === undefined
    }, [ error ]);

    return { form, isValid, error, submit, clear }
}


export default useForm
