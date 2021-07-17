import Head from 'next/head'

export default function Home() {

    async function handleSubmit(event) {
        event.preventDefault();
        let email = event.target.email.value;
        let password = event.target.password.value;

        if (!email || !password) {
            alert('Para registrar una cuenta tienes que especificar un correo electrónico y una contraseña')
            return;
        }

        const res = await fetch(
            '/api/authenticate/register',
            {
                body: JSON.stringify({
                    email,
                    password
                }),
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'POST'
            }
        )

        const result = await res.json();
        // result.status => 'success'
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen
    bg-gradient-to-br from-blue-200 to-blue-300 text-gray-700
    p-6">
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <h1 className="text-5xl font-bold text-center">
                Crea una cuenta
            </h1>
            <p className="mt-3 text-xl text-center">
                Ya tienes una? {' '}
                <a href="#" className="text-blue-700">
                    Inicia sesión
                </a>
            </p>

            <div className="bg-white w-full md:w-6/12 lg:w-4/12 rounded p-8 mt-12 shadow-lg">

                <form className="" onSubmit={handleSubmit}>

                    <fieldset className="flex flex-col">
                        <label htmlFor="email"
                               className="text-sm font-medium">
                            Correo electrónico
                        </label>
                        <input type="email" id="email"
                               className="border border-gray-300 rounded-lg px-2.5 py-1.5 mt-2
                               focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"/>
                    </fieldset>

                    <fieldset className="flex flex-col mt-6">
                        <label htmlFor="password"
                               className="text-sm font-medium">
                            Contraseña
                        </label>
                        <input type="password" id="password"
                               className="border border-gray-300 rounded-lg px-2.5 py-1.5 mt-2
                               focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"/>
                    </fieldset>

                    <button type="submit"
                            className="w-full bg-blue-400 text-white py-2 mt-10 rounded font-medium">
                        Crear cuenta
                    </button>
                </form>
            </div>
        </div>
    )
}
