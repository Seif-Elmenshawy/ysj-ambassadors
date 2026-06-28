export default function Loading({ style }: { style?: React.CSSProperties }) {
  return (
    <div className="loading" style={style}>
      <div className="loader">
        <span>YSJ</span>
      </div>
    </div>
  )
}
