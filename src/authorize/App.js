import { useAuthorize } from '/hooks/useAuthorize'

export default function App() {
  const { authorize, authorizeing } = useAuthorize()

  return (
    <div>
      <h2>Want to authorize?</h2>
      <button onClick={() => authorize(true)} disabled={authorizeing}>Accept</button>
      <button onClick={() => authorize(false)} disabled={authorizeing}>Reject</button>
    </div>
  )
}
