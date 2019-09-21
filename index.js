const input = require('./maze.json')

const visited = []

const isVisited = (coord) => {
  return visited.reduce((a, v) => {
    return isSame(v, coord) && a
  }, true)
}

const addVisited = (coord) => {
  visited.push(coord)
}

const isSame = (coord1, coord2) => {
  Object.keys(coord1).reduce((a, c) => {
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
      .map(d => solvePath(mover[d](currentPos)), endPos, path + d, spaces, mover)
      .filter(p => p)
}

const solve = ({dimensions, size, spaces, start, end, prizes}) => {
  const mover = generateMover(dimensions)
  const startPos = convertCoord(dimensions, start)
  const endPos = convertCoord(dimensions, end)
  const path = solvePath(startPos, endPos, "", spaces, mover)
  
  console.log(path)  
}


solve(input)