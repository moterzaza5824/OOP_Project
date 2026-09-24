import logo from '../assets/kin-kee-kon-logo.png'

type HeaderProps = {
  onCreateRecipe: () => void
}

export function Header({ onCreateRecipe }: HeaderProps) {
  return (
    <header id="top" className="site-header">
      <div className="site-header__content">
        <a className="site-header__brand" href="#top">
          <img src={logo} alt="KIN KEE KON" />
        </a>

        <nav className="site-header__nav" aria-label="เมนูหลัก">
          <a href="#top">สูตรของฉัน</a>
          <a href="#guide">วิธีใช้งาน</a>
        </nav>

        <button
          className="button button--primary"
          type="button"
          onClick={onCreateRecipe}
        >
          + สร้างสูตรใหม่
        </button>
      </div>
    </header>
  )
}
