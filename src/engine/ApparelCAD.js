    // Marker Komplit Semua Size dalam 1 Gelaran (Multi-Size Full Set)
    generateFullSetMarker(fabricWidthCM = 80) {
        const sizes = ['S', 'M', 'L', 'XL'];
        let layoutPatterns = [];
        let currentX = 5;
        let currentY = 5;
        let maxHeightInRow = 0;
        let totalMarkerHeight = 0;

        // Menyusun semua pola size S, M, L, XL secara otomatis di dalam batas lebar kain
        sizes.forEach(size => {
            const front = this.draftLeggingPart(size, 'front', false);
            const back = this.draftLeggingPart(size, 'back', true);
            const itemMaxH = Math.max(front.height, back.height);

            // Cek apakah muat ke samping, jika tidak turun ke baris berikutnya
            if (currentX + (front.width * 2) > fabricWidthCM - 5) {
                currentX = 5;
                currentY += maxHeightInRow + 5;
                maxHeightInRow = 0;
            }

            // Masukkan pola Front & Back ke marker
            layoutPatterns.push({ data: front, offsetX: currentX, offsetY: currentY, rotate: 0 });
            layoutPatterns.push({ data: back, offsetX: currentX + front.width + 2, offsetY: currentY, rotate: 0 });

            currentX += front.width * 2 + 8;
            if (itemMaxH > maxHeightInRow) maxHeightInRow = itemMaxH;
        });

        totalMarkerHeight = currentY + maxHeightInRow + 10;
        const requiredMetersPerSpread = (totalMarkerHeight / 100).toFixed(2); // Hitung meter per 1 kali gelar

        return {
            fabricWidth: Number(fabricWidthCM),
            patternHeight: totalMarkerHeight,
            estimatedYield: requiredMetersPerSpread,
            description: "Full Set Komplit (S, M, L, XL dalam 1 Gelar)",
            patterns: layoutPatterns
        };
    }
