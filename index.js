const testInput = require('./maze.json')
// const testInput = require('./test-maze-1.json')

class Visiter {
  constructor(){
    this.visited = []
  }

  isVisited(coord) {
    return this.visited.reduce((a, v) => {
      return isSame(v, coord) || a
    }, false)
  }
  
  addVisited(coord) {
    this.visited.push(coord)
  }
  
  flushVisted() {
    this.visited = []
  }
}

class Coordinate {
  constructor(dimensions, position){
    this.dimensions = dimensions
    this.position = position
    this.coordinate = this.posToCoord(position)
  }

  posToCoord(pos){
    const prep = pos.replace("(", "").replace(")", "").split(",")
    return prep.reduce((a, c, i)=>{
      a[this.dimensions[i]] = parseInt(c)
      return a
    }, { key: pos})
  }

  isSame(coord){
    return Object.keys(this.coordinate).reduce((a, c) => this.coordinate[c] === coord[c] && a)
  }
}

const isSame = (coord1, coord2) => {
  return Object.keys(coord1).reduce((a, c) => c !== 'key' ? coord1[c] === coord2[c] && a : a, true)
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
  }, { key: pos})
}

const coordToPos = (dimensions, coord) => `(${dimensions.map(d => coord[d]).join(',')})`

const solvePath = (currentCoord, endCoord, path, spaces, mover, visiter = new Visiter()) => {
  
  if(visiter.isVisited(currentCoord))
    return null
  else if(isSame(currentCoord, endCoord))
    return path
  else
    visiter.addVisited(currentCoord)
    return getMoves(currentCoord, spaces)
      .map(d => solvePath(mover[d](currentCoord), endCoord, path + d, spaces, mover, visiter))
      .filter(p => !!p)
      .reduce((a, c) => a == "" || a.length > c.length ? c : a, "")
}

const mapPrizes = (dimensions, prizes)=>{
  return Object.keys(prizes).map(p => ({
    coord: posToCoord(dimensions, p),
    prize: prizes[p],
  }))
}

const calcEstCost = (startCoord, coord, endCoord, spaces, mover)=>{
  const startToCoord = solvePath(startCoord, coord, "", spaces, mover)
  const coordToEnd = solvePath(coord, endCoord, "", spaces, mover)
  return startToCoord.length + coordToEnd.length
}

const calcDistance = (coord1, coord2, dimensions) => {
  return Math.sqrt(dimensions.map(d => coord2[d] - coord1[d]).map(d => d * d).reduce((a, c) => a + c, 0))
}

const solve = ({dimensions, size, spaces, start, end, prizes}) => {
  const mover = generateMover(dimensions)
  const startCoord = posToCoord(dimensions, start)
  const endCoord = posToCoord(dimensions, end)
  const mappedPrizes = mapPrizes(dimensions, prizes)
  const distanceIndicies = {
    [start]: {
      [end]: calcDistance(startCoord, endCoord, dimensions),
      ...mappedPrizes.reduce((a, c) => {
        return {
          ...a,
          [c.coord.key]: calcDistance(startCoord, c.coord, dimensions)
        }
      }, {})
    }
  }

  console.log(distanceIndicies)
  
  
  return solvePath(startCoord, endCoord, "", spaces, mover)
}


console.log(solve(testInput))