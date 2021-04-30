import './App.css'
import foreground from './images/foreground.png'
import background from './images/background.jpg'
import ball from './images/ball.png'

const App = () => {
  return (
    <div className='parallax'>
      <section id='hero' className='parallax__group'>
        <div className='parallax__layer parallax__layer--deep'>
          <img src={background} />
        </div>
        <div className='parallax__layer parallax__layer--ball'>
          <img src={ball} />
        </div>
        <div className='parallax__layer parallax__layer--back info'>
          <div>
            <h1>Sachin Tendulkar</h1>
            <p>Former Indian cricketer, widely regarded to be the <b>“greatest cricketer of all time”</b>.<br />But is it actually true?</p>
            <button>Let's find out!<br /><i className='fas fa-chevron-down' /></button>
          </div>
        </div>
        <div className='parallax__layer parallax__layer--foreground' style={{ pointerEvents: 'none' }}>
          <img src={foreground} />
        </div>
      </section>
      <section id='stats' className='parallax__group'>
        <div className='parallax__layer--base'>
          <svg className='svgWave' viewBox="0 0 1920 200" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
            <path fill="#ffffff" d="M 0 200 C 291.3 200 679.7 110 971 110 L 971 110 L 971 0 L 0 0 Z" strokeWidth="0"></path>
            <path fill="#ffffff" d="M 970 110 C 1255 110 1635 200 1920 200 L 1920 200 L 1920 0 L 970 0 Z" strokeWidth="0"></path>
          </svg>
          <div className="content">
            asdf
          </div>
        </div>
      </section>
    </div>
  );
}

export default App
