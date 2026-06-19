document.addEventListener('DOMContentLoaded', () => {

    // 제품 추가
    const addProductBtn = document.getElementById('addProductBtn');
    const addModal = document.getElementById('addProductModal');
    const cancelAddBtn = document.getElementById('cancelAddBtn');
    const addProductForm = document.getElementById('addProductForm');

    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => { addModal.style.display = 'flex'; });
    }
    if (cancelAddBtn) {
        cancelAddBtn.addEventListener('click', () => { addModal.style.display = 'none'; });
    }
    if (addModal) {
        addModal.addEventListener('click', (event) => {
            if (event.target === addModal) { addModal.style.display = 'none'; }
        });
    }

    if (addProductForm) {
        addProductForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(addProductForm);
            const data = {
                name: formData.get('name'),
                price: parseInt(formData.get('price'), 10),
                quantity: parseInt(formData.get('quantity'), 10)
            };

            fetch('/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
                .then(response => response.json().then(body => ({ ok: response.ok, status: response.status, body: body })))
                .then(res => {
                    if (res.ok) {
                        alert('제품이 성공적으로 추가되었습니다');
                        addModal.style.display = 'none';
                        addProductForm.reset();
                        location.reload();
                    } else {
                        handleErrorResponse(res.body);
                    }
                })
                .catch(error => handleFetchError(error, '제품 추가'));
        });
    }


    // 제품 삭제
    const deleteButtons = document.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const productId = event.target.dataset.productId;

            if (confirm('정말로 이 상품을 삭제하시겠습니까?')) {
                fetch(`/admin/products/${productId}`, {
                    method: 'DELETE'
                })
                    .then(response => response.text().then(text => ({ ok: response.ok, status: response.status, text: text })))
                    .then(res => {
                        if (res.ok) {
                            alert(res.text);
                            location.reload();
                        } else {
                            try {
                                const errorBody = JSON.parse(res.text);
                                handleErrorResponse(errorBody);
                            } catch (e) {
                                alert('서버 오류가 발생했습니다.');
                            }
                        }
                    })
                    .catch(error => handleFetchError(error, '제품 삭제'));
            }
        });
    });


    // 제품 수정
    const editModal = document.getElementById('editProductModal');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
    const editProductForm = document.getElementById('editProductForm');
    const editButtons = document.querySelectorAll('.btn-edit');

    editButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const productId = event.target.dataset.productId;

            fetch(`/admin/products/${productId}`)
                .then(response => response.json())
                .then(product => {
                    document.getElementById('editProductId').value = product.productId;
                    document.getElementById('editName').value = product.name;
                    document.getElementById('editPrice').value = product.price;
                    document.getElementById('editQuantity').value = product.quantity;
                    editModal.style.display = 'flex';
                })
                .catch(error => handleFetchError(error, '상품 정보 조회'));
        });
    });

    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', () => {
            editModal.style.display = 'none';
        });
    }

    if (editModal) {
        editModal.addEventListener('click', (event) => {
            if (event.target === editModal) {
                editModal.style.display = 'none';
            }
        });
    }

    if (editProductForm) {
        editProductForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(editProductForm);
            const productId = formData.get('productId');
            const data = {
                name: formData.get('name'),
                price: formData.get('price') ? parseInt(formData.get('price'), 10) : null,
                quantity: formData.get('quantity') ? parseInt(formData.get('quantity'), 10) : null
            };

            fetch(`/admin/products/${productId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
                .then(response => response.json().then(body => ({ ok: response.ok, status: response.status, body: body })))
                .then(res => {
                    if (res.ok) {
                        alert('제품 정보가 성공적으로 수정되었습니다!');
                        editModal.style.display = 'none';
                        location.reload();
                    } else {
                        handleErrorResponse(res.body);
                    }
                })
                .catch(error => handleFetchError(error, '제품 수정'));
        });
    }


    // QR 코드
    const qrModal = document.getElementById('qrCodeModal');
    const cancelQrBtn = document.getElementById('cancelQrBtn');
    const printQrBtn = document.getElementById('printQrBtn');
    const qrCodeCanvas = document.getElementById('qrCodeCanvas');
    const qrModalTitle = document.getElementById('qrModalTitle');
    const qrButtons = document.querySelectorAll('.btn-qr');

    qrButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const productId = event.target.dataset.productId;
            const productName = event.target.dataset.productName;

            qrModalTitle.textContent = `[${productName}] QR 코드`;

            const MY_PC_IP = '192.168.168.158';
            const qrUrl = 'http://' + MY_PC_IP + ':8080/consumer/cart/add/' + productId;

            new QRious({
                element: qrCodeCanvas,
                value: qrUrl,
                size: 250,
                padding: 15
            });

            qrModal.style.display = 'flex';
        });
    });

    if (cancelQrBtn) {
        cancelQrBtn.addEventListener('click', () => {
            qrModal.style.display = 'none';
        });
    }

    if (qrModal) {
        qrModal.addEventListener('click', (event) => {
            if (event.target === qrModal) {
                qrModal.style.display = 'none';
            }
        });
    }

    if (printQrBtn) {
        printQrBtn.addEventListener('click', () => {
            const productName = qrModalTitle.textContent;
            const qrImgDataUrl = qrCodeCanvas.toDataURL('image/png');
            const printWindow = window.open('', 'PRINT', 'height=400,width=400');

            printWindow.document.write('<html><head><title>' + productName + '</title>');
            printWindow.document.write('<style> body { text-align: center; margin-top: 40px; } </style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write('<h2>' + productName + '</h2>');
            printWindow.document.write('<img src="' + qrImgDataUrl + '" style="width:300px; height:300px;">');
            printWindow.document.write('</body></html>');

            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        });
    }
});
