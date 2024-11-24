import {useEffect, useState} from 'react'
import './App.css'

export interface GetRandomUserResult {
    results: User[]
    info: GetRandomUserResultInfo
}

export interface User {
    gender: string
    name: Name
    location: Location
    email: string
    login: Login
    dob: Dob
    registered: Registered
    phone: string
    cell: string
    id: Id
    picture: Picture
    nat: string
}

export interface Name {
    title: string
    first: string
    last: string
}

export interface Location {
    street: Street
    city: string
    state: string
    country: string
    postcode: number
    coordinates: Coordinates
    timezone: Timezone
}

export interface Street {
    number: number
    name: string
}

export interface Coordinates {
    latitude: string
    longitude: string
}

export interface Timezone {
    offset: string
    description: string
}

export interface Login {
    uuid: string
    username: string
    password: string
    salt: string
    md5: string
    sha1: string
    sha256: string
}

export interface Dob {
    date: string
    age: number
}

export interface Registered {
    date: string
    age: number
}

export interface Id {
    name: string
    value: string
}

export interface Picture {
    large: string
    medium: string
    thumbnail: string
}

export interface GetRandomUserResultInfo {
    seed: string
    results: number
    page: number
    version: string
}

async function getRandomUser(): Promise<User | null> {
    try {
        const response = await fetch('https://randomuser.me/api/');
        const result: GetRandomUserResult = await response.json()

        const { results } = result

        return results[0]
    } catch (e) {
        console.error(e)
        return null
    }
}

function App() {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        getRandomUser()
            .then((user) => setUser(user))
    }, [])

    // fiber узел
    // useContext
    // useReducer
    // useCallback

    if (user)
        return (
            <section className="user-card">
                <div className={'user-card__main-info'}>
                    <img
                        className={'user-card__avatar'}
                        src={user.picture.large}
                        alt="avatar"
                    />
                    <p className={'user-card__field'}>
                        <span className={'user-card__field__title'}>
                            Пол:
                        </span>
                        {user.gender === 'male' ? 'Мужчина' : 'Женщина'}
                    </p>
                </div>

                <p className={'user-card__field'}>
                        <span className={'user-card__field__title'}>
                            Страна:
                        </span>
                    {user.location.country}
                </p>

                <p className={'user-card__field'}>
                    <span className={'user-card__field__title'}>
                        Фамилия:
                    </span>
                    {user.name.last}
                </p>

                <p className={'user-card__field'}>
                    <span className={'user-card__field__title'}>
                        Имя:
                    </span>
                    {user.name.first}
                </p>

                <p className={'user-card__field'}>
                    <span className={'user-card__field__title'}>
                        Email:
                    </span>
                    {user.email}
                </p>

                <p className={'user-card__field'}>
                    <span className={'user-card__field__title'}>
                        Телефон:
                    </span>
                    {user.cell}
                </p>
            </section>
        )

    return (
        <>
            <p>User is empty</p>
        </>
    )
}

export default App

