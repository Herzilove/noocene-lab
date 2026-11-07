export function Orbit({ small = false }: { small?: boolean }) {
  return <div className={`orbit ${small ? 'orbit-small' : ''}`} aria-hidden="true"><div className="orbit-glow"/><div className="orbit-ring ring-one"/><div className="orbit-ring ring-two"/><div className="orbit-ring ring-three"/><div className="orbit-core"/><span className="orbit-star star-one"/><span className="orbit-star star-two"/><span className="orbit-star star-three"/></div>;
}
