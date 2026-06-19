// 관리자 페이지 공통 스크립트

/**
 * 서버가 내려준 에러 응답을 사용자 알림으로 변환
 * - { error: "메세지" } 형태이거나, 필드별 검증 에러 맵 형태 모두 처리
 */
function handleErrorResponse(errorBody) {
    let errorMsg = "요청 처리 중 오류가 발생했습니다:\n\n";
    if (errorBody.error) {
        errorMsg += `* ${errorBody.error}`;
    } else {
        for (const field in errorBody) {
            errorMsg += `* ${errorBody[field]}\n`;
        }
    }
    alert(errorMsg);
}

/**
 * fetch 자체가 실패(네트워크 오류 등)했을 때의 공통 처리
 */
function handleFetchError(error, actionName) {
    console.error(`'${actionName}' 중 심각한 오류 발생:`, error);
    alert(`${actionName} 중 서버 통신에 실패했습니다.`);
}

/**
 * '.btn-refund' 버튼들에 환불 처리 핸들러를 바인딩
 * @param {Function} onSuccess 환불 성공 후 실행할 콜백 (페이지마다 다름: 새로고침/이동 등)
 */
function bindRefundButtons(onSuccess) {
    const refundButtons = document.querySelectorAll('.btn-refund');

    refundButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const purchaseId = event.target.dataset.purchaseId;

            if (confirm('정말로 이 주문(ID: ' + purchaseId + ')을 환불하시겠습니까?\n(상품 재고가 다시 추가됩니다.)')) {

                fetch(`/admin/purchases/${purchaseId}/refund`, {
                    method: 'POST'
                })
                    .then(response => response.text().then(text => ({ ok: response.ok, status: response.status, text: text })))
                    .then(res => {
                        if (res.ok) {
                            alert(res.text);
                            onSuccess();
                        } else {
                            try {
                                const errorBody = JSON.parse(res.text);
                                handleErrorResponse(errorBody);
                            } catch (e) {
                                alert('서버 오류가 발생했습니다.');
                            }
                        }
                    })
                    .catch(error => handleFetchError(error, '환불 처리'));
            }
        });
    });
}
