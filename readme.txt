================================================================================
                        BuStudy 웹 프로젝트 UI 스타일 가이드
================================================================================

작성일: 2025년 11월 22일
프로젝트명: BuStudy_Web
기술 스택: React + TypeScript + Tailwind CSS + Vite


================================================================================
1. 컬러 팔레트 (Color Palette)
================================================================================

[Primary Color - Orange]
- Primary 500:  bg-orange-500    (#f97316) - 주요 버튼, 강조 요소
- Primary 600:  bg-orange-600    (#ea580c) - Hover 상태
- Primary 700:  bg-orange-700    (#c2410c) - Active 상태
- Primary 50:   bg-orange-50     (#fff7ed) - 배경 강조
- Primary 100:  bg-orange-100    (#ffedd5) - 카드 테두리
- Primary 200:  bg-orange-200    (#fed7aa) - 카드 테두리
- Primary 800:  text-orange-800  (#9a3412) - 강조 텍스트

[Neutral Colors - Gray]
- Gray 50:      bg-gray-50       (#f9fafb) - 페이지 배경
- Gray 100:     bg-gray-100      (#f3f4f6) - 보조 배경, 지도 영역
- Gray 200:     bg-gray-200      (#e5e7eb) - Hover 배경
- Gray 300:     border-gray-300  (#d1d5db) - 입력 필드 테두리
- Gray 500:     text-gray-500    (#6b7280) - 보조 텍스트
- Gray 600:     text-gray-600    (#4b5563) - 레이블, 설명 텍스트
- Gray 700:     text-gray-700    (#374151) - 일반 텍스트
- Gray 800:     text-gray-800    (#1f2937) - 헤딩, 강조 텍스트
- Gray 900:     text-gray-900    (#111827) - 주요 텍스트

[Semantic Colors]
- Success:      bg-green-500     (#22c55e) - 성공 메시지
- Error:        text-red-500     (#ef4444) - 에러 메시지, 경고
- Warning:      bg-yellow-500    (#eab308) - 경고 메시지
- Info:         bg-blue-500      (#3b82f6) - 정보 메시지

[Background Colors]
- White:        bg-white         (#ffffff) - 카드, 패널, 헤더
- Transparent:  bg-white/95      - 반투명 오버레이 (95% 불투명도)


================================================================================
2. 타이포그래피 (Typography)
================================================================================

[Font Family]
- 기본 폰트: 시스템 폰트 스택 (Tailwind CSS 기본값)
  sans-serif: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 
              "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif

[Font Sizes]
- text-xs:     0.75rem (12px)    - 보조 정보, 라벨
- text-sm:     0.875rem (14px)   - 입력 필드, 버튼, 일반 텍스트
- text-base:   1rem (16px)       - 기본 본문
- text-lg:     1.125rem (18px)   - 헤더 타이틀
- text-xl:     1.25rem (20px)    - 섹션 제목
- text-2xl:    1.5rem (24px)     - 페이지 제목
- text-4xl:    2.25rem (36px)    - 대형 숫자 표시 (예: 예상 시간)

[Font Weights]
- font-normal:       400 - 일반 텍스트
- font-medium:       500 - 중간 강조
- font-semibold:     600 - 라벨, 헤딩
- font-bold:         700 - 버튼, 주요 헤딩

[Line Heights]
- 기본: Tailwind 기본값 사용
- 카드 내부: leading-relaxed (1.625)


================================================================================
3. 버튼 스타일 (Button Styles)
================================================================================

[Primary Button - 주요 액션]
클래스: px-4 py-2 text-sm font-bold text-white bg-orange-500 rounded 
        hover:bg-orange-600 active:bg-orange-700

속성:
- 배경: bg-orange-500
- 텍스트: text-white, text-sm, font-bold
- 패딩: px-4 py-2
- 모서리: rounded (4px)
- Hover: hover:bg-orange-600
- Active: active:bg-orange-700
- Disabled: opacity-60

사용 예시:
<button 
  className="px-4 py-2 text-sm font-bold text-white bg-orange-500 rounded hover:bg-orange-600 active:bg-orange-700"
>
  계산하기
</button>


[Secondary Button - 보조 액션]
클래스: px-4 py-2 text-sm text-gray-600 bg-gray-100 border rounded 
        hover:bg-gray-200

속성:
- 배경: bg-gray-100
- 텍스트: text-gray-600, text-sm
- 테두리: border
- 패딩: px-4 py-2
- 모서리: rounded (4px)
- Hover: hover:bg-gray-200

사용 예시:
<button 
  className="px-4 py-2 text-sm text-gray-600 bg-gray-100 border rounded hover:bg-gray-200"
>
  취소
</button>


[Floating Action Button - 플로팅 버튼]
클래스: flex items-center justify-center px-6 py-3 font-bold text-white 
        transition-transform bg-orange-500 rounded-full shadow-xl 
        hover:bg-orange-600 hover:scale-105 active:scale-95

속성:
- 배경: bg-orange-500
- 텍스트: text-white, font-bold
- 패딩: px-6 py-3
- 모서리: rounded-full (완전 원형)
- 그림자: shadow-xl
- 애니메이션: hover:scale-105, active:scale-95, transition-transform
- Hover: hover:bg-orange-600

사용 예시:
<button 
  className="flex items-center justify-center px-6 py-3 font-bold text-white 
             transition-transform bg-orange-500 rounded-full shadow-xl 
             hover:bg-orange-600 hover:scale-105 active:scale-95"
>
  경로 설정하기
</button>


[Icon Button - 아이콘 버튼]
클래스: inline-flex items-center justify-center p-2 text-gray-700 rounded-md 
        hover:bg-gray-100

속성:
- 배경: 투명 (hover:bg-gray-100)
- 텍스트: text-gray-700
- 패딩: p-2
- 모서리: rounded-md
- 아이콘 크기: w-6 h-6

사용 예시:
<button 
  className="inline-flex items-center justify-center p-2 text-gray-700 rounded-md hover:bg-gray-100"
>
  <svg className="w-6 h-6">...</svg>
</button>


[Button States]
- Default: 기본 상태
- Hover: hover:bg-orange-600 (Primary), hover:bg-gray-200 (Secondary)
- Active: active:bg-orange-700 (Primary)
- Disabled: opacity-60, disabled 속성 추가
- Loading: opacity-60, 버튼 내 스피너 추가


================================================================================
4. 입력 필드 스타일 (Input Field Styles)
================================================================================

[Text Input - 기본 텍스트 입력]
클래스: w-full px-3 py-2 text-sm border border-gray-300 rounded 
        focus:outline-none focus:border-orange-500

속성:
- 너비: w-full (100%)
- 패딩: px-3 py-2
- 텍스트: text-sm
- 테두리: border border-gray-300
- 모서리: rounded (4px)
- Focus: focus:outline-none, focus:border-orange-500
- Placeholder: placeholder 속성 사용

사용 예시:
<input
  className="w-full px-3 py-2 text-sm border border-gray-300 rounded 
             focus:outline-none focus:border-orange-500"
  placeholder="예: 강남역 (Enter로 정류장 검색)"
/>


[Text Input with Label - 라벨이 있는 입력]
<div className="flex flex-col gap-1">
  <label className="text-xs font-semibold text-gray-600">
    출발지
  </label>
  <input
    className="w-full px-3 py-2 text-sm border border-gray-300 rounded 
               focus:outline-none focus:border-orange-500"
    placeholder="예: 강남역"
  />
</div>


[Input States]
- Default: border-gray-300
- Focus: focus:border-orange-500, focus:outline-none
- Error: border-red-500
- Disabled: bg-gray-100, cursor-not-allowed


================================================================================
5. 카드 스타일 (Card Styles)
================================================================================

[Basic Card - 기본 카드]
클래스: p-4 bg-white rounded shadow-sm

속성:
- 패딩: p-4
- 배경: bg-white
- 모서리: rounded (4px)
- 그림자: shadow-sm

사용 예시:
<div className="p-4 bg-white rounded shadow-sm">
  카드 내용
</div>


[Info Card - 정보 카드]
클래스: p-3 bg-orange-50 border border-orange-100 rounded

속성:
- 패딩: p-3
- 배경: bg-orange-50
- 테두리: border border-orange-100
- 모서리: rounded (4px)

사용 예시:
<div className="p-3 bg-orange-50 border border-orange-100 rounded">
  <span className="font-bold text-orange-800">🚗 결과: </span>
  <span className="text-gray-800">내용</span>
</div>


[Floating Card - 플로팅 카드]
클래스: bg-white rounded-2xl shadow-2xl p-4 min-w-[280px] border border-orange-200

속성:
- 배경: bg-white
- 모서리: rounded-2xl (16px)
- 그림자: shadow-2xl
- 패딩: p-4
- 최소 너비: min-w-[280px]
- 테두리: border border-orange-200

사용 예시:
<div className="bg-white rounded-2xl shadow-2xl p-4 min-w-[280px] border border-orange-200">
  <div className="flex items-center gap-2 mb-3">
    <span className="text-2xl">🚌</span>
    <span className="font-bold text-gray-800">이동 예상 시간</span>
  </div>
  <div className="text-center py-4">
    <div className="text-4xl font-bold text-orange-600">25분</div>
    <div className="text-sm text-gray-500 mt-2">예상 소요시간</div>
  </div>
</div>


================================================================================
6. 드롭다운/리스트 스타일 (Dropdown/List Styles)
================================================================================

[Dropdown Container]
클래스: absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 
        rounded shadow-lg max-h-60 overflow-y-auto z-30

속성:
- 위치: absolute, top-full, left-0, right-0
- 여백: mt-1
- 배경: bg-white
- 테두리: border border-gray-300
- 모서리: rounded
- 그림자: shadow-lg
- 최대 높이: max-h-60
- 스크롤: overflow-y-auto
- Z-index: z-30


[List Item Button]
클래스: w-full p-3 text-left transition-colors border-b hover:bg-orange-50 
        last:border-b-0

속성:
- 너비: w-full
- 패딩: p-3
- 정렬: text-left
- 애니메이션: transition-colors
- 테두리: border-b, last:border-b-0
- Hover: hover:bg-orange-50

사용 예시:
<button 
  className="w-full p-3 text-left transition-colors border-b hover:bg-orange-50 last:border-b-0"
>
  <div className="font-medium text-sm text-gray-900">항목 제목</div>
  <div className="text-xs text-gray-500 mt-1">보조 정보</div>
</button>


================================================================================
7. 로딩 인디케이터 (Loading Indicators)
================================================================================

[Spinner - 기본 스피너]
클래스: w-4 h-4 border-2 border-orange-500 rounded-full 
        border-t-transparent animate-spin

속성:
- 크기: w-4 h-4 (작은 스피너), w-8 h-8 (큰 스피너)
- 테두리: border-2 border-orange-500
- 모서리: rounded-full
- 투명 영역: border-t-transparent
- 애니메이션: animate-spin

사용 예시:
<div className="inline-block w-4 h-4 border-2 border-orange-500 rounded-full 
                border-t-transparent animate-spin">
</div>


[Loading Container]
<div className="p-3 text-center">
  <div className="inline-block w-4 h-4 border-2 border-orange-500 rounded-full 
                  border-t-transparent animate-spin">
  </div>
  <p className="text-sm text-gray-600 mt-2">정류장 검색 중...</p>
</div>


================================================================================
8. 레이아웃 (Layout)
================================================================================

[Container - 컨테이너]
클래스: max-w-5xl mx-auto px-4 sm:px-6 lg:px-8

속성:
- 최대 너비: max-w-5xl (1024px)
- 가운데 정렬: mx-auto
- 패딩: px-4 (모바일), sm:px-6 (태블릿), lg:px-8 (데스크탑)


[Page Wrapper]
클래스: min-h-screen bg-gray-50

속성:
- 최소 높이: min-h-screen (전체 화면)
- 배경: bg-gray-50


[Header]
클래스: relative z-20 w-full bg-white shadow-sm

속성:
- 위치: relative, z-20
- 너비: w-full
- 배경: bg-white
- 그림자: shadow-sm
- 높이: h-16 (내부 컨테이너)


[Grid Layout]
클래스: grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto]

속성:
- 레이아웃: grid
- 모바일: grid-cols-1 (1열)
- 태블릿 이상: sm:grid-cols-[1fr_1fr_auto] (3열)
- 간격: gap-3


[Flex Layout]
클래스: flex items-center justify-between

속성:
- 레이아웃: flex
- 수직 정렬: items-center
- 수평 정렬: justify-between / justify-center


================================================================================
9. 반응형 디자인 (Responsive Design)
================================================================================

[Breakpoints]
- sm:  640px  이상  - 태블릿
- md:  768px  이상  - 태블릿 가로
- lg:  1024px 이상  - 데스크탑
- xl:  1280px 이상  - 대형 데스크탑


[Mobile First 접근]
- 기본: 모바일 스타일
- sm: 이상부터 태블릿/데스크탑 스타일 적용

예시:
className="text-sm sm:text-base lg:text-lg"
className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
className="hidden sm:block"  // 모바일에서 숨김
className="sm:hidden"  // 태블릿 이상에서 숨김


================================================================================
10. 그림자 (Shadows)
================================================================================

[Shadow Levels]
- shadow-sm:   작은 그림자 - 카드, 패널
- shadow:      기본 그림자 - 일반 요소
- shadow-md:   중간 그림자 - 모달, 팝업
- shadow-lg:   큰 그림자 - 드롭다운
- shadow-xl:   매우 큰 그림자 - 플로팅 버튼
- shadow-2xl:  최대 그림자 - 중요 플로팅 카드


================================================================================
11. 모서리 둥글기 (Border Radius)
================================================================================

[Radius Sizes]
- rounded:      0.25rem (4px)  - 기본 (버튼, 입력, 카드)
- rounded-md:   0.375rem (6px) - 중간
- rounded-lg:   0.5rem (8px)   - 큰
- rounded-xl:   0.75rem (12px) - 매우 큰
- rounded-2xl:  1rem (16px)    - 플로팅 카드
- rounded-full: 9999px         - 완전 원형 (FAB 버튼)


================================================================================
12. 간격 (Spacing)
================================================================================

[Padding]
- p-2:   0.5rem (8px)   - 작은 패딩
- p-3:   0.75rem (12px) - 중간 패딩
- p-4:   1rem (16px)    - 기본 패딩
- p-6:   1.5rem (24px)  - 큰 패딩
- px-3:  좌우 0.75rem
- py-2:  상하 0.5rem
- px-4:  좌우 1rem
- py-3:  상하 0.75rem

[Margin]
- mt-1:  0.25rem (4px)
- mt-2:  0.5rem (8px)
- mt-3:  0.75rem (12px)
- mt-4:  1rem (16px)
- mb-2:  하단 0.5rem
- mb-4:  하단 1rem
- mx-auto: 좌우 자동 (가운데 정렬)

[Gap]
- gap-1:  0.25rem (4px)
- gap-2:  0.5rem (8px)
- gap-3:  0.75rem (12px)
- gap-4:  1rem (16px)


================================================================================
13. 애니메이션 & 트랜지션 (Animation & Transition)
================================================================================

[Transitions]
- transition-colors:    색상 전환 애니메이션
- transition-transform: 변형 애니메이션
- transition-all:       모든 속성 전환

[Scale Animations]
- hover:scale-105:  Hover 시 5% 확대
- active:scale-95:  클릭 시 5% 축소

[Spin Animation]
- animate-spin:  무한 회전 (로딩 스피너)

사용 예시:
className="transition-transform hover:scale-105 active:scale-95"
className="transition-colors hover:bg-orange-50"


================================================================================
14. Z-Index 레이어링 (Z-Index Layering)
================================================================================

[Z-Index Levels]
- z-0:   지도, 배경 레이어
- z-10:  플로팅 버튼, 하단 UI
- z-20:  헤더
- z-30:  드롭다운, 팝업


================================================================================
15. 접근성 (Accessibility)
================================================================================

[ARIA 속성]
- aria-label: 스크린 리더용 레이블
- aria-expanded: 확장 상태 표시
- aria-hidden: 스크린 리더에서 숨김

[포커스 스타일]
- focus:outline-none: 기본 아웃라인 제거
- focus:border-orange-500: 포커스 시 테두리 강조
- focus:ring-2: 포커스 링 표시

[키보드 네비게이션]
- Enter 키로 검색 트리거
- Tab 키로 요소 간 이동


================================================================================
16. 에러 & 상태 메시지 (Error & Status Messages)
================================================================================

[Error Message]
클래스: p-3 text-center text-red-500 text-sm

사용 예시:
<div className="p-3 text-center text-red-500 text-sm">
  에러 메시지
</div>

[Success Message]
클래스: p-3 text-center text-green-500 text-sm

[Info Message]
클래스: p-3 text-center text-gray-600 text-sm


================================================================================
17. 아이콘 사용 가이드 (Icon Usage)
================================================================================

[Emoji Icons]
- 주로 이모지 사용: 🚌 🚗 🎯 📍
- 크기: text-2xl (큰 아이콘), 기본 크기 (작은 아이콘)

[SVG Icons]
- 크기: w-6 h-6 (일반), w-4 h-4 (작은)
- 색상: currentColor 사용하여 텍스트 색상 상속


================================================================================
18. 코딩 컨벤션 (Coding Conventions)
================================================================================

[클래스 순서]
1. 레이아웃 (flex, grid, relative, absolute)
2. 크기 (w-, h-, min-, max-)
3. 간격 (p-, m-, gap-)
4. 타이포그래피 (text-, font-)
5. 색상 (bg-, text-, border-)
6. 테두리 (border, rounded)
7. 그림자 (shadow)
8. 애니메이션 (transition, hover, active)
9. 기타 (z-, overflow, cursor)

예시:
className="flex items-center w-full p-4 text-sm font-bold text-white 
           bg-orange-500 border rounded shadow-sm transition-colors 
           hover:bg-orange-600"


[조건부 스타일]
className={`base-classes ${condition ? 'conditional-classes' : ''}`}

예시:
className={`px-4 py-2 text-white bg-orange-500 rounded ${
  loading ? "opacity-60" : ""
}`}


================================================================================
19. 성능 최적화 (Performance Optimization)
================================================================================

[이미지 최적화]
- SVG 로고 사용
- 적절한 이미지 크기 설정

[CSS 최적화]
- Tailwind CSS의 JIT 모드 활용
- 사용하지 않는 스타일 자동 제거 (purge)

[렌더링 최적화]
- 조건부 렌더링으로 불필요한 DOM 요소 최소화
- 스크롤 영역에 overflow-y-auto 사용


================================================================================
20. 브랜드 가이드라인 (Brand Guidelines)
================================================================================

[로고]
- 파일: BuStudy.svg
- 위치: src/assets/logo/
- 크기: h-10 (40px)
- 여백: 로고 주변 최소 8px 여백 유지

[브랜드 컬러]
- Primary: Orange (#f97316) - 활동적이고 친근한 이미지
- Secondary: Gray - 중립적이고 깔끔한 느낌

[톤 앤 매너]
- 친근하고 접근하기 쉬운 느낌
- 깔끔하고 모던한 디자인
- 사용자 친화적인 인터페이스


================================================================================
21. 사용 예시 및 템플릿 (Examples & Templates)
================================================================================

[페이지 템플릿]
```jsx
const PageTemplate = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl p-4 mx-auto sm:p-6 lg:p-8">
        <h2 className="mb-2 text-2xl font-bold">페이지 제목</h2>
        <p className="mb-4 text-sm text-gray-600">
          페이지 설명
        </p>

        <div className="p-4 space-y-3 bg-white rounded shadow-sm">
          {/* 페이지 내용 */}
        </div>
      </main>
    </div>
  );
};
```

[폼 템플릿]
```jsx
<div className="flex flex-col gap-1">
  <label className="text-xs font-semibold text-gray-600">
    라벨
  </label>
  <input
    className="w-full px-3 py-2 text-sm border border-gray-300 rounded 
               focus:outline-none focus:border-orange-500"
    placeholder="플레이스홀더"
  />
</div>

<div className="flex gap-2 mt-4">
  <button 
    className="px-4 py-2 text-sm font-bold text-white bg-orange-500 rounded 
               hover:bg-orange-600 active:bg-orange-700"
  >
    확인
  </button>
  <button 
    className="px-4 py-2 text-sm text-gray-600 bg-gray-100 border rounded 
               hover:bg-gray-200"
  >
    취소
  </button>
</div>
```


================================================================================
22. 주의사항 및 제약사항 (Notes & Constraints)
================================================================================

[DO's - 해야 할 것]
✓ Tailwind CSS 유틸리티 클래스 사용
✓ 반응형 디자인 항상 고려
✓ 일관된 간격과 크기 사용
✓ 의미 있는 색상 사용 (Primary = 주요 액션)
✓ 접근성 고려 (aria-label, focus 스타일)
✓ 로딩 상태 명확히 표시
✓ 에러 메시지 사용자 친화적으로 작성

[DON'Ts - 하지 말아야 할 것]
✗ 인라인 스타일 사용 지양
✗ 임의의 색상 값 사용 금지
✗ 컴포넌트별 서로 다른 스타일 적용
✗ 과도한 애니메이션 사용
✗ 접근성 무시
✗ 반응형 디자인 생략
✗ 일관성 없는 버튼 크기


================================================================================
23. 향후 개선 방향 (Future Improvements)
================================================================================

1. 다크 모드 지원 추가
2. 커스텀 Tailwind 테마 확장
3. 컴포넌트 라이브러리 구축
4. 애니메이션 라이브러리 도입 (Framer Motion 등)
5. 디자인 토큰 시스템 구축
6. Storybook을 통한 컴포넌트 문서화


================================================================================
문서 버전: 1.0
최종 수정일: 2025년 11월 22일
작성자: BuStudy 개발팀
================================================================================
