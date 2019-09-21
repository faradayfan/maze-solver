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

const convertCoord = (dimensions, coord) => {
  const prep = coord.replace("(", "").replace(")", "").split(",")
  return prep.reduce((a, c, i)=>{
    a[dimensions[i]] = parseInt(c)
    return a
  }, {})
}

const solvePath = (currentPos, endPos, path, spaces, mover) => {
  if(isVisited(currentPos))
    return null
  else if(isSame(currentPos, endPos))
    return path
  else
    addVisited(currentPos)
    return getMoves(currentPos, spaces)
      .map(d => solvePath(mover[d](currentPos), endPos, path + d, spaces, mover))
      .filter(p => !!p)
      .reduce((a, c) => a == "" || a.length > c.length ? c : a, "")
}

const collectAllPrizes = (startPos, mover, dimensions, spaces, prizes) => {
  const prizesPoss = Object.keys(prizes).map(p => ({
    coord: convertCoord(dimensions, p),
    prize: prizes[p],
    key: p
  }))
  let currentPos = startPos
  let currentPath = ""
  while(prizesPoss.length) {
    const foundPrize = prizesPoss.map(({coord, ...rest}) => {
      const path = solvePath(currentPos, coord, "", spaces, mover)
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
    currentPos = foundPrize.coord
    currentPath = currentPath + foundPrize.path
    prizesPoss.splice(prizesPoss.findIndex(p => isSame(p.coord, foundPrize.coord)), 1)
  }

  return {
    currentPos,
    path: currentPath
  }
}


const solve = ({dimensions, size, spaces, start, end, prizes}) => {
  const mover = generateMover(dimensions)
  const startPos = convertCoord(dimensions, start)
  const endPos = convertCoord(dimensions, end)

  return solvePath(startPos, endPos, "", spaces, mover)
}


console.log(solve(testInput))