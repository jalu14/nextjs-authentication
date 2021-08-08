import Head from "next/head";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";

export default function User() {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;
        getUser();
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        fetch('/api/user',
            {
                body: JSON.stringify(user),
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('token')
                },
                method: 'PUT'
            })
            .then(res => res.json())
            .then(res => {
                if (res.status === 'success') {
                    alert('Datos actualizados')
                }
            });
    }

    async function getUser() {
        fetch('/api/user',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': localStorage.getItem('token')
                },
                method: 'GET'
            })
            .then(res => res.json())
            .then(res => {
                if (res.status === 'success') {
                    console.log(res);
                    setUser(res.data.user);
                }
            });
    }

    function closeSession() {
        localStorage.removeItem('token');
        router.push('/login');
    }

    if (!user) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen
    bg-gradient-to-br from-blue-200 to-blue-300 text-gray-700 p-6">
                <Head>
                    <title>Next.js Auth</title>
                    <link rel="icon" href="/favicon.ico" />
                </Head>

                <h1 className="text-5xl font-bold text-center">
                    Loading...
                </h1>
            </div>
        )
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen
    bg-gradient-to-br from-blue-200 to-blue-300 text-gray-700 p-6">
            <Head>
                <title>Next.js Auth</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <h1 className="text-5xl font-bold text-center">
                Hola, {user.data?.name || '-'}
            </h1>

            <div className="bg-white w-full md:w-6/12 lg:w-4/12 xl:w-3/12 rounded p-8 mt-12 shadow-lg">

                <form className="" onSubmit={handleSubmit}>

                    <fieldset className="flex flex-col">
                        <label htmlFor="email"
                            className="text-sm font-medium">
                            Correo electrónico
                        </label>
                        <input type="email" id="email"
                            value={user.email}
                            onChange={e => setUser({ ...user, email: e.target.value })}
                            className="border border-gray-300 rounded-lg px-2.5 py-1.5 mt-2
                               focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"/>
                    </fieldset>

                    <fieldset className="flex flex-col mt-4">
                        <label htmlFor="name"
                            className="text-sm font-medium">
                            Nombre
                        </label>
                        <input type="text" id="name"
                            value={user.data.name}
                            onChange={e => {
                                let newUser = { ...user };
                                newUser.data.name = e.target.value;
                                setUser(newUser);
                            }}
                            className="border border-gray-300 rounded-lg px-2.5 py-1.5 mt-2
                               focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"/>
                    </fieldset>

                    <button type="submit"
                        className="w-full bg-blue-400 text-white py-2 mt-10 rounded font-medium">
                        Actualizar datos
                    </button>

                    <button type="button" onClick={() => closeSession()}
                        className="w-full bg-red-400 text-white py-2 mt-4 rounded font-medium">
                        Cerrar sesión
                    </button>
                </form>
            </div>
        </div>
    )
}