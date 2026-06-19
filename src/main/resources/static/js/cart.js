// 브라우저가 뒤로가기 감지시 페이지 새로고침
window.addEventListener('pageshow', function(event) {
    if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
        window.location.reload();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const purchaseBtn = document.getElementById('purchaseBtn');

    purchaseBtn.addEventListener('click', () => {

        if (confirm('카카오페이로 결제를 진행하시겠습니까?')) {

            // 결제 준비 API 호출
            fetch('/consumer/payment/ready', {
                method: 'POST'
            })
                .then(response => response.json().then(body => ({ ok: response.ok, body: body })))
                .then(res => {
                    if (res.ok) {
                        // 성공 시 카카오톡 앱 실행 URL로 이동
                        const redirectUrl = res.body.next_redirect_mobile_url;
                        window.location.href = redirectUrl;
                    } else {
                        // 실패
                        alert("결제 준비 실패:\n\n* " + res.body.error);
                    }
                })
                .catch(error => {
                    console.error('결제 준비 중 오류 발생:', error);
                    alert('서버 통신에 실패했습니다.');
                });
        }
    });
});
