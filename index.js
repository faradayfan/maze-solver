const input = require('./maze.json')


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

const solve = ({dimensions, size, spaces, start, end, prizes}) => {
  const mover = generateMover(dimensions)
  const startPos = convertCoord(dimensions, start)
  
  const newCoords = mover.X(startPos) // {y: 1, x, 2}
  console.log(newCoords)

  
}

solve(input)