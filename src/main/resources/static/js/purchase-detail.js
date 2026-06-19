// 주문 검색 결과 페이지 (공통: admin-common.js)
document.addEventListener('DOMContentLoaded', () => {
    // 환불 성공 시 전체 주문 목록 페이지로 이동
    bindRefundButtons(() => { window.location.href = '/admin/purchases'; });
});
