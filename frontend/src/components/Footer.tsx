export default function Footer() {
  return (
    <footer className="bg-white border-t py-6">
      <div className="container mx-auto px-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} MeuSite. Todos os direitos reservados.
      </div>
    </footer>
  );
}