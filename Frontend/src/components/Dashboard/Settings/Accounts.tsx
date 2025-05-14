

const Accounts = () => {
    return (
        <div>
            <button className="w-full flex-1 text-coral bg-[#FBEFEE] text-md font-semibold p-2 hover:bg-[#fddddd] transition-colors rounded-sm"
                onClick={() => { window.location.href = 'https://routine-jf3l.onrender.com/api/google/auth'; }}
            >
                Google SignIn
            </button>
        </div>
    )
}

export default Accounts
