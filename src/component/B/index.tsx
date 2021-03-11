import React from 'react'

export default ({ children }: { children: React.ReactDOM }) => {
  return (
    <div className="component-b">
      {children} B111
    </div>
  )
}