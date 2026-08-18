import { useEffect, useState } from 'react'
import { Outlet } from '@tanstack/react-router'
import styles from './DefaultLayout.module.css';
export function DefaultLayout() {
  const [isH5, setIsH5] = useState(false)
  
  // 切换 html[data-pch5]，让 index.css 中的 @custom-variant pch5 生效
  useEffect(() => {
      const el = document.documentElement;
      if (isH5) el.dataset.pch5 = '';
      else delete el.dataset.pch5;
    }, [isH5])
    
const [isDark, setIsDark] = useState(false)
  useEffect(() => {
      const el = document.documentElement;
      if (isDark) el.dataset.theme = 'dark';
      else el.removeAttribute('data-theme');
    }, [isDark])

  return (
    <div className={`${styles['default-layout']}`}>
      <header  className={`${styles['default-layout__header']}  flex`}>
        <h1 className="md:max-lg:font-light flex-1 text-primarytext">verify-module</h1>
        <button
          className="w-[1rem] text-[0.18rem]  bg-sidebar text-primarytext hover:bg-hover"
          onClick={() => setIsH5((v) => !v)}
        >
          h5模式
        </button>
        <button
          className="w-[1rem] text-[0.18rem]  bg-sidebar text-primarytext hover:bg-hover"
          onClick={() => setIsDark((v) => !v)}
        >
          {isDark ? '☀️ 浅色' : '🌙 深色'}
        </button>
      </header>
      <main className={`${styles['default-layout__main']}`}>
        {/* <p className={`${styles['laytout-title']} pch5:md:max-lg:text-red-500 max-xs:bg-black xs:bg-white pch5:xs:bg-black`}>
          内容区
        </p> */}
        <p className={`${styles['laytout-title']} text-primary-text bg-surface`}>
          内容区
        </p>
        <Outlet />
      </main>
    </div>
  )
}