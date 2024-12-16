export const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="w-full fixed bottom-0 text-center text-sm text-gray-500 bg-white py-2">
            Copyright &copy; {currentYear} SMAN 5 Kota Tegal
        </footer>
    );
};
