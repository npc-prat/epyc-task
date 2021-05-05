import { useEffect, useState } from 'react'
import { ResponsiveLine } from '@nivo/line'
import { ResponsivePie } from '@nivo/pie'

import overviewData from './overview.json'
import odiStats from './odi-stats.json'
import recordData from './records.json'

import './App.css'
import foreground from './images/foreground.png'
import background from './images/background.jpg'
import ball from './images/ball.png'

const App = () => {
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
            <div className='container'>
              <h2>A closer look at his performance in ODIs</h2>
              <OdiSection />
            </div>
            <div className='container'>
              <h2>Some of Tendulkar's unbroken records <span>(as of May 2021)</span></h2>
              <div className='records'>
                {recordData.map((record, index) => (
                  <div key={index} className='record'>
                    <h4>{record.title}</h4>
                    <span>{record.value}</span>
                    <p>{record.format}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className='container verdict'>
              <h2>And now, the verdict...</h2>
              <p>
                <i className='fas fa-award' />
                Based on the data, we think it's fair to say that Sachin Tendulkar is, in fact, the&nbsp;
                <span>
                  GOAT🐐
                  <div className='tooltip'>
                    Greatest Of All Time<br />
                    <a href="https://www.dictionary.com/e/slang/g-o-a-t/">Dictionary.com</a>
                  </div>
                </span>
                &nbsp;in cricket.
              </p>
            </div>
          </main>
        </div>
        <footer>
          <div className="container">
            Made with <i className='fas fa-coffee' />, <i className='fas fa-code' /> and <i className='fas fa-heart'></i> by Pratik
            <span>|<a href='https://github.com/pratvar/epyc-task'>View on Github</a></span>
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
        {Object.keys(overviewData).map(tableName => (
          <li key={tableName}>
            <button className={activeView === tableName ? 'active' : ''} onClick={() => { setActiveView(tableName) }}>
              {tableName[0].toUpperCase() + tableName.slice(1)}
            </button>
          </li>
        ))}
      </ul>
      <div className={`table-slider ${activeView}`}>
        {Object.keys(overviewData).map(tableName => (
          <div key={tableName} className='table-wrapper'>
            <table>
              <thead>
                <tr>
                  {overviewData[tableName].headers.map((header, index) => <th key={index} className={index === 0 ? 'left' : ''}>{header}</th>)}
                </tr>
              </thead>
              <tbody>
                {overviewData[tableName].rows.map((row, index) => (
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

const OdiSection = () => {

  const [data, setData] = useState(null)
  const [groupBy, setGroupBy] = useState('year')
  const [activeView, setActiveView] = useState(0)
  const [selectedCountry, selectCountry] = useState(0)

  function getActiveViewLabel(activeView) {
    switch (activeView) {
      case 0: return 'batting_score'
      case 1: return 'wickets'
      case 2: return 'runs_conceded'
      case 3: return 'catches'
      default: break
    }
  }

  useEffect(() => { // Run only once (on mount)
    const colors = {
      blue: '#2196f3',
      yellow: '#ffc107',
      red: '#f44336',
      green: '#4caf50'
    }
    const dataTemplate = {
      lineChartData: [
        { id: 'line', color: colors.blue, data: [] },
        { id: 'line', color: colors.yellow, data: [] },
        { id: 'line', color: colors.red, data: [] },
        { id: 'line', color: colors.green, data: [] },
      ],
      pieChartData: [
        { id: 'Won', label: 'Won', color: colors.green, value: 0 },
        { id: 'Lost', label: 'Lost', color: colors.red, value: 0 },
        { id: 'Tied', label: 'Tied', color: colors.yellow, value: 0 },
        { id: 'N/R', label: 'N/R', color: colors.blue, value: 0 },
      ]
    }
    function getValue(input) {
      if (Number.isInteger(input)) return input
      else if (/^\d+[*]$/.test(input)) return parseInt(input.slice(0, -1))
      else return 0
    }

    // Group data by year
    const groupedByYear = odiStats.reduce((data, game) => {
      const year = game.date.slice(-4)
      data.lineChartData.forEach((item, i) => {
        let existingIndex = item.data.findIndex(element => element.x === year)
        let exists = existingIndex !== -1
        if (exists) item.data[existingIndex].y += getValue(game[getActiveViewLabel(i)])
        else item.data.push({ x: year, y: getValue(game[getActiveViewLabel(i)]) })
      })
      switch (game['match_result']) {
        case 'won': data.pieChartData[0].value += 1
          break
        case 'lost': data.pieChartData[1].value += 1
          break
        case 'tied': data.pieChartData[2].value += 1
          break
        default: data.pieChartData[3].value += 1
      }
      return data
    }, { ...JSON.parse(JSON.stringify(dataTemplate)) })

    // Group data by opposition
    const groupedByOpposition = odiStats.reduce((array, game) => {
      const country = game.opposition.slice(2)
      let existingIndex = array.findIndex(item => item.country === country)
      let exists = existingIndex !== -1
      if (exists) array[existingIndex].matches += 1
      else array.push({
        country,
        matches: 1,
        ...JSON.parse(JSON.stringify(dataTemplate))
      })
      return array
    }, []).sort((a, b) => b.matches - a.matches)
    odiStats.forEach(game => {
      const country = game.opposition.slice(2)
      let index = groupedByOpposition.findIndex(item => item.country === country)
      groupedByOpposition[index].lineChartData.forEach((item, i) => {
        item.data.push({ x: item.data.length + 1, y: getValue(game[getActiveViewLabel(i)]) })
      })
      switch (game['match_result']) {
        case 'won': groupedByOpposition[index].pieChartData[0].value += 1
          break
        case 'lost': groupedByOpposition[index].pieChartData[1].value += 1
          break
        case 'tied': groupedByOpposition[index].pieChartData[2].value += 1
          break
        default: groupedByOpposition[index].pieChartData[3].value += 1
      }
    })

    setData({
      year: groupedByYear,
      opposition: groupedByOpposition,
    })

  }, [])

  if (!data) return null

  let activeData = groupBy === 'year' ? data.year : data.opposition[selectedCountry]

  return (
    <div className='odi-stats'>
      <div className='group-selector'>
        Group by
        <ul className='selector'>
          <span className={groupBy} />
          <li><button onClick={() => { setGroupBy('year') }} className={groupBy === 'year' ? 'active' : ''}>Year</button></li>
          <li><button onClick={() => { setGroupBy('opposition') }} className={groupBy === 'opposition' ? 'active' : ''}>Opposition</button></li>
        </ul>
      </div>
      <div className='content-wrapper'>
        <ul className={`country-selector ${groupBy === 'opposition' ? 'active' : ''}`}>
          {data.opposition.map((item, index) => (
            <li key={item.country}>
              <button className={index === selectedCountry ? 'active' : ''} onClick={() => { selectCountry(index) }}>
                {item.country}
                <span>{`${item.matches} ${item.matches > 1 || item.matches === 0 ? 'matches' : 'match'}`}</span>
              </button>
            </li>
          ))}
        </ul>
        <div className='content'>
          <div className='overall-stats'>
            <div className='header'>
              <h3>Stats</h3>
              <ul className='selector'>
                <span className={'view-' + activeView} />
                <li><button className={activeView === 0 ? 'active' : ''} onClick={() => { setActiveView(0) }}>Batting Score</button></li>
                <li><button className={activeView === 1 ? 'active' : ''} onClick={() => { setActiveView(1) }}>Wickets</button></li>
                <li><button className={activeView === 2 ? 'active' : ''} onClick={() => { setActiveView(2) }}>Runs Conceded</button></li>
                <li><button className={activeView === 3 ? 'active' : ''} onClick={() => { setActiveView(3) }}>Catches</button></li>
              </ul>
            </div>
            <div className='line-chart'>
              <ResponsiveLine
                data={[activeData.lineChartData[activeView]]}
                margin={{ top: 5, right: 5, bottom: groupBy === 'year' ? 30 : 5, left: 35 }}
                axisBottom={groupBy === 'year' ? {
                  tickRotation: -45
                } : null}
                colors={data => data.color}
                curve={'catmullRom'}
                enableGridX={false}
                enableArea
                enableSlices='x'
                sliceTooltip={({ slice }) => (
                  <div style={{
                    padding: '0.75em',
                    backgroundColor: 'white',
                    borderRadius: 5,
                    boxShadow: '0 1px 2px #bdbdbd'
                  }}>
                    <div style={{ color: '#757575', marginBottom: '0.25em' }}>{slice.points[0].data.x}</div>
                    <div>
                      {getActiveViewLabel(activeView).split('_').map(word => word[0].toUpperCase() + word.slice(1)).join(' ') + ': '}
                      <b>{slice.points[0].data.y}</b>
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
          <div className='match-stats'>
            <h3>Match Results</h3>
            <div className='stats-wrapper'>
              <div className='pie-chart'>
                <ResponsivePie
                  data={activeData.pieChartData}
                  margin={{ top: 15, right: 70, bottom: 15, left: 70 }}
                  colors={params => params.data.color}
                  innerRadius={0.4}
                  arcLinkLabelsDiagonalLength={10}
                  arcLinkLabelsStraightLength={15}
                />
              </div>
              <ul>
                <li>
                  <i className='fas fa-baseball-ball' />
                  <div>
                    {activeData.pieChartData.reduce((acc, cur) => (acc + cur.value), 0)}<br />
                    <span>Total</span>
                  </div>
                </li>
                <li>{activeData.pieChartData[0].value}<br /><span>Won</span></li>
                <li>{activeData.pieChartData[1].value}<br /><span>Lost</span></li>
                <li>{activeData.pieChartData[2].value}<br /><span>Tied</span></li>
                <li>{activeData.pieChartData[3].value}<br /><span>N/R</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
