const ToggleTheme = ( { toggleTheme, theme } ) => {
    return (
        <div className="mb-6">
            <div className="flex items-center cursor-pointer">
                <button className="relative cursor-pointer" onClick={toggleTheme}>
                    <div className="w-12 h-6 rounded-full shadow-inner 
                    transition-colors duration-300 bg-gray-400 dark:bg-btn-dark"></div>
                    <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white
                  rounded-full shadow-md transform transition-transform duration-300
                  translate-x-0 dark:translate-x-7"></div>
                </button>
                <span className="ml-3 text-gray-700 dark:text-gray-200 font-medium">{theme}</span>
            </div>
        </div>
    );
}

export default ToggleTheme;