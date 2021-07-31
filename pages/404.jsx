import Head from 'next/head';

export default function NotFound() {

    return (
        <div className="flex flex-col justify-center items-center min-h-screen
    bg-gradient-to-br from-blue-200 to-blue-300 text-gray-700
    p-6">
            <Head>
                <title>Next.js Auth</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <h1 className="text-5xl font-bold text-center">
                ¡404! <br /> Página no encontrada
            </h1>
            <p className="mt-3 text-xl text-center">
                Te has perdido? {' '}
                <a href="/" className="text-blue-700">
                    Volver a inicio
                </a>
            </p>
        </div>
    )
}
