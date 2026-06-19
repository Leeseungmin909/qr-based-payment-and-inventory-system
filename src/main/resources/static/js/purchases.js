// 주문/환불 관리 페이지 (공통: admin-common.js)
document.addEventListener('DOMContentLoaded', () => {
    // 환불 성공 시 목록을 새로고침
    bindRefundButtons(() => location.reload());
});
