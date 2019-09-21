const input = require('./maze.json')

const visited = []

const isVisited = (coord) => {
  return visited.reduce(v => {
    
  })
}

const addVisited = (coord) => {
  visited.push(coord)
}


const generateMover = (dimensions) => {
  return dimensions.reduce((a, d)=> {
    a[d.toUpperCase()] = ({[d]: v, ...rest}) => ({[d]: v + 1, ...rest})
    a[d.toLowerCase()] = ({[d]: v, ...rest}) => ({[d]: v - 1, ...rest})
    return a
  }, {})
}

const convertCoord = (dimensions, coord) => {
  const prep = coord.replace("(", "").replace(")", "").split(",")
  return prep.reduce((a, c, i)=>{
    a[dimensions[i]] = parseInt(c)
    return a
  }, {})
}

const solvePath = (currentPos, path) => {
  if(isVisited(currentPos))
    return null
  else if(isEnd(currentPos))
    return path
  else
    addVisited(currentPos)
    return getMoves(currentPos)
      .map(d => solvePath(mover[d](currentPos)), d, maze)
      .filter(p => p)
}

const solve = ({dimensions, size, spaces, start, end, prizes}) => {
  const mover = generateMover(dimensions)
  const startPos = convertCoord(dimensions, start)
  const endPos = convertCoord(dimensions, end)
  
  console.log(newCoords)  
}


solve(input)