export function Footer() {
    const currentYear = new Date().getFullYear()
  
    return (
      <footer className="mt-auto border-t py-6 ml-0 md:ml-[calc(var(--sidebar-width)-20px)]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-sm text-muted-foreground">© {currentYear} Marketplace Admin. All rights reserved.</div>
  
            <div className="flex gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    )
  }
  
  