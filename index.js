const input = require('./maze.json')
const testInput = require('./test-maze-1.json')

let visited = []

const isVisited = (coord) => {
  const result = visited.reduce((a, v) => {
    return isSame(v, coord) || a
  }, false)
  return result
}

const addVisited = (coord) => {
  visited.push(coord)
}

const flushVisted = () => {
  visited = []
}

const isSame = (coord1, coord2) => {
  return Object.keys(coord1).reduce((a, c) => {
    return coord1[c] === coord2[c] && a
  }, true)
}

const generateMover = (dimensions) => {
  return dimensions.reduce((a, d)=> {
    a[d.toUpperCase()] = ({[d]: v, ...rest}) => ({[d]: v + 1, ...rest})
    a[d.toLowerCase()] = ({[d]: v, ...rest}) => ({[d]: v - 1, ...rest})
    return a
  }, {})
}

const getMoves = (coord, spaces) => {
  return spaces.reduce((a, c) => {
    if(isSame(coord, c)){
      return c.moves.split('')
    }else
      return a
  }, [])
}

const posToCoord = (dimensions, pos) => {
  const prep = pos.replace("(", "").replace(")", "").split(",")
  return prep.reduce((a, c, i)=>{
    a[dimensions[i]] = parseInt(c)
    return a
  }, {})
}

const coordToPos = (dimensions, coord) => `(${dimensions.map(d => coord[d]).join(',')})`

const solvePath = (currentCoord, endCoord, path, spaces, mover) => {
  if(isVisited(currentCoord))
    return null
  else if(isSame(currentCoord, endCoord))
    return path
  else
    addVisited(currentCoord)
    return getMoves(currentCoord, spaces)
      .map(d => solvePath(mover[d](currentCoord), endCoord, path + d, spaces, mover))
      .filter(p => !!p)
      .reduce((a, c) => a == "" || a.length > c.length ? c : a, "")
}

const collectAllPrizes = (startCoord, mover, dimensions, spaces, prizes) => {
  const prizesCoords = Object.keys(prizes).map(p => ({
    coord: posToCoord(dimensions, p),
    prize: prizes[p],
    key: p
  }))
  let currentCoord = startCoord
  let currentPath = ""
  while(prizesCoords.length) {
    const foundPrize = prizesCoords.map(({coord, ...rest}) => {
      const path = solvePath(currentCoord, coord, "", spaces, mover)
      return {
        path,
        coord,
        ...rest
      }  
    }).filter(p => p && !!p.path)
    .map(({path, prize, ...rest}) => ({
      path,
      prize,
      cost: path.length,
      gain: prize - path.length,
      ...rest
    })).reduce((a, c) => a.gain < c.gain ? c : a)
    flushVisted()
    console.log({foundPrize})
    currentCoord = foundPrize.coord
    currentPath = currentPath + foundPrize.path
    prizesCoords.splice(prizesCoords.findIndex(p => isSame(p.coord, foundPrize.coord)), 1)
  }

  return {
    currentCoord: currentCoord,
    path: currentPath
  }
}

const mapPrizes = (dimensions, prizes)=>{
  return Object.keys(prizes).map(p => ({
    coord: posToCoord(dimensions, p),
    prize: prizes[p],
    key: p
  }))
}






const solve = ({dimensions, size, spaces, start, end, prizes}) => {
  const mover = generateMover(dimensions)
  const startCoord = posToCoord(dimensions, start)
  const endCoord = posToCoord(dimensions, end)
  const mappedPrizes = mapPrizes(dimensions, prizes)
  



  console.log(mappedPrizes)
  

  return solvePath(startCoord, endCoord, "", spaces, mover)
}


console.log(solve(testInput))