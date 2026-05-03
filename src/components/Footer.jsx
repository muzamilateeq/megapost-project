export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__grid">
        <div className="site-footer__col">
          <h3 className="site-footer__heading">Company</h3>
          <ul className="site-footer__list">
            <li>
              <a href="#about">About us</a>
            </li>
            <li>
              <a href="#careers">Careers</a>
            </li>
            <li>
              <a href="#press">Press</a>
            </li>
          </ul>
        </div>
        <div className="site-footer__col">
          <h3 className="site-footer__heading">Support</h3>
          <ul className="site-footer__list">
            <li>
              <a href="#help">Help center</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
            <li>
              <a href="#status">System status</a>
            </li>
          </ul>
        </div>
        <div className="site-footer__col">
          <h3 className="site-footer__heading">Legal</h3>
          <ul className="site-footer__list">
            <li>
              <a href="#privacy">Privacy policy</a>
            </li>
            <li>
              <a href="#terms">Terms of service</a>
            </li>
            <li>
              <a href="#cookies">Cookie settings</a>
            </li>
          </ul>
        </div>
      </div>
      <p className="site-footer__copy">
        © {new Date().getFullYear()} MagaPost. All rights reserved.
      </p>
    </footer>
  )
}
