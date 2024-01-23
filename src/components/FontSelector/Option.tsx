export function Option(props: { family: string; fullName: string }) {
  const { family, fullName } = props;

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <span style={{ marginRight: '2em' }}>{`${fullName}(${family})`}</span>
      <span style={{ fontFamily: family }}>Hello，新年快乐 😊 ！</span>
    </div>
  );
}
