import { useLocation } from 'react-router-dom';

type TypedLocation<S> = Omit<ReturnType<typeof useLocation>, 'state'> & { state: S };

export function useTypedLocation<S = unknown>() {
  return useLocation() as TypedLocation<S>;
}
