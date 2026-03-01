export default function Register() {
    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
            <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
            <form>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="name">Name</label>
                    <input  
                        type="text"
                        id="name"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        placeholder="Enter your name"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        placeholder="Enter your email"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                        placeholder="Enter your password"
                    />
                </div>
                <button

                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                >
                    Register
                </button>
            </form>
        </div>
    );
}