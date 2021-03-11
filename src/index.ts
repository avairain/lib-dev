 const a: () => void = () => {
  console.log('a')
}

a()
a()
import B from './component/B/index'
export { a, B }
import App from './1'

export default App