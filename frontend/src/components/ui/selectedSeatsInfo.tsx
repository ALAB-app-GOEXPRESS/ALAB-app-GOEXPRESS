// import React from 'react';
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
// import type { SelectedSeat } from '@/types/Seat';
// import { convertSeatCdToLabel } from '@/utils/seat';

// interface SelectedSeatsInfoProps {
//   selectedSeats: SelectedSeat[];
//   onConfirm: () => void;
// }

// export const SelectedSeatsInfo: React.FC<SelectedSeatsInfoProps> = ({ selectedSeats }) => {
//   return (
//     <div className='fixed top-24 right-4 w-80 z-10 hidden lg:block'>
//       <Card>
//         <CardHeader>
//           <CardTitle>選択中の座席</CardTitle>
//           <CardDescription>{selectedSeats.length} 席 選択中</CardDescription>
//         </CardHeader>
//         <CardContent className='max-h-60 overflow-y-auto'>
//           {selectedSeats.length > 0 ? (
//             <ul className='space-y-2'>
//               {selectedSeats.map(({ carNumber, seatId }) => (
//                 <li
//                   key={`${carNumber}-${seatId}`}
//                   className='text-sm'
//                 >
//                   {`${carNumber}号車 ${convertSeatCdToLabel(seatId)}`}
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p className='text-sm text-muted-foreground'>座席が選択されていません</p>
//           )}
//         </CardContent>
//         {/* <CardFooter>
//           <Button
//             onClick={onConfirm}
//             className='w-full'
//             disabled={selectedSeats.length === 0}
//           >
//             この座席で予約を確定する
//           </Button>
//         </CardFooter> */}
//       </Card>
//     </div>
//   );
// };
