import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Owners Club</h3>
            <p className="text-sm text-muted-foreground">
              The community for honest monitor reviews from real owners.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Browse</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/monitors" className="hover:text-primary">Monitors</Link></li>
              <li><Link href="/reviews" className="hover:text-primary">Reviews</Link></li>
              <li><Link href="/compare" className="hover:text-primary">Compare</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Community</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/community" className="hover:text-primary">Discussions</Link></li>
              <li><Link href="/leaderboard" className="hover:text-primary">Leaderboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Owners Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
