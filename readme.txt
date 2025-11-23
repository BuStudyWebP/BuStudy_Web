스타일 가이드

================================================================================
1. 색상
================================================================================

주 색상 (Orange)
• 메인:      #f97316  → bg-orange-500
• 호버:      #ea580c  → bg-orange-600
• 눌림:      #c2410c  → bg-orange-700
• 연한 배경: #fff7ed  → bg-orange-50
• 테두리용:  #ffedd5  → bg-orange-100
• 진한 텍스트: #9a3412 → text-orange-800

회색 계열
• 페이지 배경:     #f9fafb → bg-gray-50
• 카드/보조 배경:   #f3f4f6 → bg-gray-100
• 호버 배경:       #e5e7eb → bg-gray-200
• 테두리:          #d1d5db → border-gray-300
• 보조 텍스트:      #6b7280 → text-gray-500
• 일반 텍스트:      #374151 → text-gray-700
• 제목/강조:        #1f2937 → text-gray-800

상태 색상
• 성공: #22c55e  (bg-green-500)
• 오류: #ef4444  (text-red-500)
• 경고: #eab308  (bg-yellow-500)
• 정보: #3b82f6   (bg-blue-500)

================================================================================
2. 글자 크기 및 굵기
================================================================================

크기
• 아주 작음: 12px → text-xs
• 작은 텍스트: 14px → text-sm
• 기본 본문: 16px → text-base
• 섹션 제목: 18–20px → text-lg / text-xl
• 페이지 제목: 24px → text-2xl
• 큰 숫자: 36px → text-4xl

굵기
• 보통: font-normal (400)
• 중간 강조: font-medium (500)
• 제목/라벨: font-semibold (600)
• 버튼/강조: font-bold (700)

================================================================================
3. 버튼
================================================================================

주 버튼 (Primary)
px-4 py-2 text-sm font-bold text-white bg-orange-500 rounded
hover:bg-orange-600 active:bg-orange-700

보조 버튼 (Secondary)
px-4 py-2 text-sm text-gray-600 bg-gray-100 border rounded
hover:bg-gray-200

플로팅 버튼 (FAB)
px-6 py-3 text-white font-bold bg-orange-500 rounded-full shadow-xl
hover:bg-orange-600 hover:scale-105 active:scale-95

아이콘 버튼
p-2 text-gray-700 rounded-md hover:bg-gray-100

================================================================================
4. 입력창
================================================================================

기본 입력창
w-full px-3 py-2 text-sm border border-gray-300 rounded
rounded focus:outline-none focus:border-orange-500

에러일 때 → border-red-500
비활성화 → bg-gray-100

라벨과 함께 쓸 때
<label className="text-xs font-semibold text-gray-600">출발지</label>
<input ... />

================================================================================
5. 카드
================================================================================

기본 카드
p-4 bg-white rounded shadow-sm

정보 강조 카드
p-3 bg-orange-50 border border-orange-100 rounded

큰 플로팅 카드 (결과창 등)
bg-white rounded-2xl shadow-2xl p-4 min-w-[280px] border border-orange-200

================================================================================
6. 드롭다운 / 검색 결과 리스트
================================================================================

드롭다운 전체
absolute z-30 w-full mt-1 bg-white border border-gray-300
rounded shadow-lg max-h-60 overflow-y-auto

각 항목
w-full p-3 text-left border-b hover:bg-orange-50
(last 항목은 border-b-0)

================================================================================
7. 상태 메시지
================================================================================

에러
p-3 text-center text-sm text-red-500

성공
p-3 text-center text-sm text-green-500

안내
p-3 text-center text-sm text-gray-600

