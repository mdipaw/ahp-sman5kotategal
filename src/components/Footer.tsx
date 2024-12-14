export const Footer = () => {
    const currentYear = new Date().getFullYear(); // Get the current year
    return (
        <footer className="w-full absolute bottom-5 text-center text-sm text-gray-500">
            Copyright &copy; {currentYear} SMA 5 N Kota Tegal
        </footer>
    );
};
