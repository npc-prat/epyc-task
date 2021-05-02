import { useState } from 'react'
import overviewData from './overview.json'
import './App.css'

import foreground from './images/foreground.png'
import background from './images/background.jpg'
import ball from './images/ball.png'

const App = () => {
  console.log(overviewData)
  return (
    <div className='parallax'>
      <section id='hero' className='parallax__group'>
        <div className='parallax__layer parallax__layer--background'>
          <img src={background} alt='background' />
        </div>
        <div className='parallax__layer parallax__layer--content info'>
          <div className='infoWrapper'>
            <h1>Sachin Tendulkar</h1>
            <p>
              Former Indian cricketer, widely regarded to be the <b>“greatest cricketer of all time”</b>.<br />
              How true is it, though?
            </p>
            <button onClick={() => { document.querySelector('main').scrollIntoView({ behavior: 'smooth' }) }}>
              Let's find out! <i className='fas fa-chevron-down' />
            </button>
          </div>
        </div>
        <div className='parallax__layer parallax__layer--foreground' style={{ pointerEvents: 'none' }}>
          <img src={foreground} alt='foreground' />
        </div>
        <div className='parallax__layer parallax__layer--base ball'>
          <img src={ball} alt='ball' />
        </div>
      </section>
      <section id='body' className='parallax__group'>
        <div className='parallax__layer--base'>
          <svg className='svgWave' viewBox='0 0 1920 125' xmlns='http://www.w3.org/2000/svg'>
            <path d='M0 95C741.907 -32.3102 1173.28 -30.7984 1920 95V125H0V95Z' fill='white' />
          </svg>
          <main>
            <div className='container'>
              <h2>Here's an overview of his career</h2>
              <OverviewSection />
            </div>
          </main>
        </div>
        <footer>
          <div className="container">
            Made with <i className='fas fa-coffee' />, <i className='fas fa-code' /> and <i className='fas fa-heart'></i> by Pratik
        </div>
        </footer>
      </section>
    </div >
  );
}

const OverviewSection = () => {
  const [activeView, setActiveView] = useState('batting')

  return (
    <div className='overview'>
      <ul className='selector'>
        <span className={activeView} />
        <li>
          <button className={activeView === 'batting' ? 'active' : ''} onClick={() => { setActiveView('batting') }}>
            Batting
          </button>
        </li>
        <li>
          <button className={activeView === 'bowling' ? 'active' : ''} onClick={() => { setActiveView('bowling') }}>
            Bowling
          </button>
        </li>
        <li>
          <button className={activeView === 'fielding' ? 'active' : ''} onClick={() => { setActiveView('fielding') }}>
            Fielding
          </button>
        </li>
      </ul>
      <div className={`table-slider ${activeView}`}>
        {Object.keys(overviewData).map(table => (
          <div className='table-wrapper'>
            <table>
              <thead>
                <tr>
                  {overviewData[table].headers.map((header, index) => <th key={index} className={index === 0 ? 'left' : ''}>{header}</th>)}
                </tr>
              </thead>
              <tbody>
                {overviewData[table].rows.map((row, index) => (
                  <tr key={index}>
                    {row.map((item, index) => typeof item === 'object'
                      ? <td key={index} className={index === 0 ? 'left' : ''}>{item.name}<br /><span>{item.time}</span></td>
                      : <td key={index} className={index === 0 ? 'left' : ''}>{item}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
