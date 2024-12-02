import useForm, { Field } from "../hooks/useForm.tsx";
import { useState} from "react";
import {Input, Select, Option, SelectOwnerState, OptionOwnerState} from "@mui/base";
import classes from "./SignUpForm.module.css";
import clsx from "clsx";


const SIGN_FORM_FIELDS: Array<Field> = [
    {
        name: 'name',
        type: 'text',
        placeholder: 'Введите...',
        label: 'Имя',
        required: true
    },
    {
        name: 'email',
        type: 'email',
        placeholder: 'Введите...',
        label: 'Email',
        required: true
    },
    {
        name: 'password',
        type: 'password',
        placeholder: 'Введите...',
        label: 'Пароль',
        required: true
    },
    {
        name: 'gender',
        type: 'select',
        placeholder: 'Введите...',
        label: 'Пол',
        required: true,
        options: [
            'мужской',
            'женский'
        ]
    }
]

function SignUpForm() {
    const { form, submit, error, clear } = useForm(SIGN_FORM_FIELDS, sendForm)
    const [isLoading, setIsLoading] = useState(false)


    function sendForm() {
        setIsLoading(() => true)
        new Promise(resolve => {
            setTimeout(() => {
                console.warn('From sended')
                resolve(true)
            }, 3000)
        })
            .then(() => {})
            .catch(e => {
                console.error(e)
            })
            .finally(() => {
                setIsLoading(() => false)
                clear()
                alert('Form is successful sended')
            })
    }

    return (
        <div className={classes.formWrapper}>
            <h1 className={classes.heading}>Sign Up</h1>
            <form
                className={classes.form}
                onSubmit={submit}
            >
                {Object.entries(form).map(([key, formField]) => {
                    if (formField.type === 'email' || formField.type === 'text' || formField.type === 'password') {
                        return (
                            <CustomInput
                                name={key}
                                key={key}
                                required={formField.required}
                                label={formField.label}
                                onChange={formField.onChange}
                                type={formField.type}
                                value={formField.value}
                            />
                        )
                    } else {
                        return (
                            <CustomSelect
                                name={key}
                                key={key}
                                required={formField.required}
                                label={formField.label}
                                onChange={formField.onChange}
                                value={formField.value}
                                options={formField.options}
                            />
                        )
                    }
                })}
                <button
                    type="submit"
                    className={classes.submitButton}
                    disabled={isLoading}
                >
                    {isLoading ? 'Загрузка' : 'Sign Up'}
                </button>
            </form>
            {error && <span className={classes.error}>{error}</span>}
        </div>
    );
}

interface CustomInputProps {
    value?: string
    label?: string
    name?: string
    required?: boolean
    onChange?: (value: string) => void
    type?: 'password' | 'text' | 'email'
}

function CustomInput(props: CustomInputProps) {
    const slotProps = {
        root: () => ({
            className: clsx(classes.rootInput),
        }),
        input: () => ({
            className: clsx(classes.input),
        })
    };

    return <div>
        <label
            htmlFor={props.name}
            className={classes.label}
        >
            {props.label}{props.required && '*'}
        </label>
        <Input
            id={props.name}
            type={props.type}
            value={props.value}
            placeholder="Введите..."
            onChange={(event) => props.onChange?.(event.target.value)}
            slotProps={slotProps}
        />
    </div>
}

interface CustomSelectProps {
    value?: string
    label?: string
    name?: string
    options: Array<string>
    required?: boolean
    onChange?: (value: string | null) => void
}


function CustomSelect(props: CustomSelectProps) {
    const slotProps = {
        root: (ownerState: SelectOwnerState<string, false>) => ({
            className: clsx(classes.select, {
                [classes.selectExpanded]: ownerState.open,
                [classes.selectEmptyValue]: !ownerState.value
            }),
        }),
        popup: () => ({
            className: clsx(classes.popup),
        }),
        listbox: () => ({
            className: clsx(classes.listbox),
        }),
    };

    const optionSlotProps = {
        root: (ownerState: OptionOwnerState<string>) => ({
            className: clsx(classes.option, {
                [classes.optionSelected]: ownerState.value === props.value,
            }),
        }),
    }


    return <div>
        <label
            htmlFor={props.name}
            className={classes.label}
        >
            {props.label}{props.required && '*'}
        </label>
        <Select
            id={props.name}
            value={props.value ?? null}
            onChange={(_, newValue) => props.onChange?.(newValue)}
            slotProps={slotProps}
            renderValue={(option) => {
                return `${option?.value || 'Выберите...'}`
            }}
        >
            {props.options.map((option, index) => (
                <Option
                    key={index}
                    value={option}
                    label={option}
                    slotProps={optionSlotProps}
                >
                    {option}
                </Option>
            ))}
        </Select>
    </div>
}

export default SignUpForm
