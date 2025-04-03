// ページ読み込み完了時に実行
document.addEventListener('DOMContentLoaded', function () {
    console.log("DOMが読み込まれました");

    // ローディングアニメーション
    initLoadingAnimation();

    // スクロールでロゴサイズ変更
    initHeaderScroll();

    // ナビゲーションリンクのクリックイベント
    initNavigation();

    // ヒーロー画像のスライドショー
    initHeroSlideshow();

    // スクロール時のアニメーション
    initScrollAnimations();

    // 作品モーダルの実装
    initWorkModal();

    // 画像の遅延読み込み
    initLazyLoading();

    // コンタクトフォームのバリデーション強化
    enhanceFormValidation();

    // 封筒の視差効果
    initEnvelopeEffect();

    // 初期関数 - ローディングアニメーション
    function initLoadingAnimation() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            // 初期ロード時にスクロールを防止
            document.body.style.overflow = 'hidden';

            // コンテンツの読み込みが完了したらローディング画面を非表示にする
            setTimeout(function () {
                loadingScreen.classList.add('hidden');
                // スクロール防止を解除
                document.body.style.overflow = '';
            }, 2800); // ロゴアニメーションの時間 + α
        }
    }

    // 初期関数 - ヘッダースクロール効果
    function initHeaderScroll() {
        window.addEventListener('scroll', function() {
            const siteLogo = document.querySelector('.site-logo');
            
            if (window.scrollY > 50) {
                siteLogo.classList.add('scrolled');
            } else {
                siteLogo.classList.remove('scrolled');
            }
        });
    }

    // 初期関数 - ナビゲーション
    function initNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach((link) => {
            link.addEventListener('click', function (e) {
                e.preventDefault();

                // クリックされたリンクから対応するセクションIDを取得
                const targetId = this.getAttribute('href').substring(1);
                console.log("ナビゲーションクリック: ターゲット =", targetId);

                // セクションIDに一致する要素を検索
                const targetSection = document.getElementById(targetId);

                if (targetSection) {
                    console.log("ターゲットセクションが見つかりました。スクロールします。");

                    // 現在のリンクをアクティブにし、他のリンクからアクティブクラスを削除
                    navLinks.forEach(nl => nl.classList.remove('active'));
                    this.classList.add('active');

                    // スムーズスクロール
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                } else {
                    console.error("ターゲットセクションが見つかりません:", targetId);
                }
            });
        });

        // スクロール位置に応じてナビゲーションを更新する関数
        function updateNavOnScroll() {
            const scrollPosition = window.scrollY;
            const sections = document.querySelectorAll('section');

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPosition >= sectionTop - 100 &&
                    scrollPosition < sectionTop + sectionHeight - 100) {

                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }

        // スクロールイベントにリスナーを追加
        window.addEventListener('scroll', updateNavOnScroll);

        // 初期状態で現在の位置に基づいてナビゲーションを更新
        updateNavOnScroll();
    }

    // 初期関数 - ヒーロースライドショー
    function initHeroSlideshow() {
        const heroBgs = document.querySelectorAll('.hero-bg');
        let currentBg = 0;

        function changeBackground() {
            heroBgs.forEach((bg) => bg.classList.remove('active'));
            currentBg = (currentBg + 1) % heroBgs.length;
            heroBgs[currentBg].classList.add('active');
        }

        // 最初の背景を表示
        if (heroBgs.length > 0) {
            heroBgs[0].classList.add('active');
            setInterval(changeBackground, 7000);
        }
    }

    // 初期関数 - スクロールアニメーション
    function initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // アニメーションが必要な要素にクラスを追加して監視
        const animateElements = document.querySelectorAll('.about-content, .skills, .work-item, .contact-form, .social-links');
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // 初期関数 - 作品モーダル
    function initWorkModal() {
        console.log("モーダル機能の初期化を開始");

        // DOM要素の取得
        const workItems = document.querySelectorAll('.work-item');
        const modal = document.getElementById('workModal');
        const modalClose = document.querySelector('.modal-close');
        const modalImg = document.querySelector('.modal-img');
        const modalTitle = document.querySelector('.modal-title');
        const modalDetails = document.querySelector('.modal-details');
        const modalDescription = document.querySelector('.modal-description');

        console.log("作品カードの数:", workItems.length);
        console.log("モーダル要素の存在:", modal ? true : false);

        if (!modal) {
            console.error("モーダル要素が見つかりません");
            return;
        }

        // 作品データ定義（複数画像対応）
        const workData = [
            {
                id: 1,
                title: '&e（アンディ） プロトタイプデザイン',
                description: '本プロジェクトでは、ユーザー観点から最適な自動車保険体験を設計し、視覚的・操作性の両面からコミュニケーションを重視したプロトタイプを作成しました。特に、運転データを活用した直感的なインターフェースと、ユーザーがスムーズに保険プランを理解・選択できる情報設計にこだわりました。デザインプロセスでは、ユーザーリサーチをもとにニーズを分析し、保険サービスにおける「安心感」と「利便性」を両立させるUIを構築しました。また、視認性の高いデザインと分かりやすいナビゲーションを実現することで、ユーザーとの円滑なコミュニケーションを促進しています。 このプロジェクトを通じて、複雑な情報をシンプルに伝えるデザインの重要性を再認識し、よりユーザー目線の体験設計を追求しました。',
                details: ['Adobe XD', 'icon作成', '画像編集', 'プロトタイピング'],
                images: [
                    'images/works/actual1-1.png',
                    'images/works/actual1-2.png',
                    'images/works/actual1-3.png'
                ]
            },
            {
                id: 2,
                title: 'elbo - 美容医療管理サイト',
                description: 'elboは、美容医療に特化した予約・管理システムとして、自社開発したプロジェクトです。ユーザーがLINEを通じてスムーズに予約できる仕組みを採用し、直感的なフォーム作成機能を備えたことで、利便性と柔軟性を両立しました。また、管理者向けのadminパネルでは、価格設定や予約の確認を簡単に行えるように設計。施術メニューの管理や顧客対応を一元化し、業務効率の向上を実現しています。ユーザーと管理者の双方にとってストレスのないUXを追求し、シンプルで洗練されたデザインを意識しました。このプロジェクトでは、ユーザー観点から美容業界の課題を捉え、スムーズなコミュニケーションを促すシステムを構築。視認性・操作性に優れたデザインとともに、美容医療の現場を支える実用的なサービスを目指しました。',
                details: ['Figma', 'プロトタイピング' , 'ロゴデザイン'],
                images: [
                    'images/works/actual2-1.png',
                    'images/works/actual2-2.png',
                    'images/works/actual2-3.png'
                ]
            },
            {
                id: 3,
                title: 'CLISTA! - 医療専門管理サイト',
                description: 'クリスタは、医用工学研究所が提供する医療専門の管理システムです。本プロジェクトでは、UIデザインの一部を担当し、特にテンプレートの改善と検索機能の最適化に取り組みました。 テンプレートデザインでは、ユーザーが直感的に操作できるレイアウトを構築し、視認性と利便性を向上。情報の整理や入力負担の軽減を意識し、実用性の高いデザインへとブラッシュアップしました。検索機能においては、アイコンのデザインを担当し、わかりやすさと視認性を両立。ユーザーが求める情報に素早くアクセスできるよう、シンプルで明確なUI設計を実現しました。このプロジェクトを通じて、医療現場における操作性と効率性を追求し、ユーザー観点からより快適な管理システムの実現を目指しました。',
                details: ['UI/UXデザイン', 'プロトタイピング', 'Figma'],
                images: [
                    'images/works/actual3-1.png',
                    'images/works/actual3-2.png',
                    'images/works/actual3-3.png'
                ]
            },
            {
                id: 4,
                title: '株式会社アスノ - コーポレートサイトデザイン',
                description: '株式会社アスノは、大阪に拠点を置く建築会社で、主に屋根工事や塗装を手掛けています。本プロジェクトでは、コーポレートサイトのデザイン・更新を担当し、企業の魅力をより引き出すことを目指しました。特に、社員同士の仲の良さやアットホームな雰囲気をサイト全体で表現することを意識。親しみやすさを感じられるビジュアルや、温かみのあるデザインを採用し、訪れたユーザーが「信頼できる会社」と直感的に感じられるよう設計しました。また、建築業界の専門性を伝えつつ、施工事例やサービス内容が分かりやすく伝わる情報設計を重視。シンプルかつ洗練されたレイアウトにすることで、視認性と操作性を向上させました。このプロジェクトを通じて、企業ブランディングとユーザー視点を融合させ、企業の魅力を最大限に引き出すデザインの在り方を追求しました。',
                details: ['webデザイン', 'UI/UXデザイン', 'Figma'],
                images: [
                    'images/works/actual4-1.png',
                    'images/works/actual4-2.png',
                    'images/works/actual4.png'
                ]
            },
            {
                id: 5,
                title: 'パラちゃんねる - 障害者雇用支援サイト',
                description: 'パラちゃんねるは、障害者雇用を支援する運営サイトです。本プロジェクトでは、UI/UXデザインの改善および管理サイト（admin）のデザインを担当し、長期間にわたり継続的なバグ修正やユーザー体験の向上に取り組みました。特に、障害を持つ方々がより快適に利用できるよう、アクセシビリティの向上を意識。色のコントラスト調整やフォントサイズの最適化、スクリーンリーダー対応など、多様なユーザーがストレスなく情報へアクセスできる設計を実現しました。また、管理サイトでは、運営側の業務負担を軽減するための直感的なインターフェースを設計。情報管理のしやすさを重視し、視認性の高いデザインを導入することで、効率的な運営を支援しました。このプロジェクトを通じて、ユーザー観点からのデザイン改善と、より多くの人に優しいデジタル環境の提供を目指しました。',
                details: ['Figma', 'UI/UX改善', '管理システムデザイン'],
                images: [
                    'images/works/actual5-1.png',
                    'images/works/actual5-2.png',
                ]
            },
            {
                id: 6,
                title: 'assists - 家庭用アプリ',
                description: '本プロジェクトでは、親子で楽しみながらタスク管理ができる家庭用アプリのデザインを担当しました。親がタスクを作成し、子供がクリアすることでポイントが貯まり、お菓子と交換できる仕組みを導入。ゲーム感覚で子供が積極的に家事や学習に取り組めるよう設計しました。デザイン面では、家庭の温かさを感じられるよう暖色を基調とし、親しみやすいUIを採用。特に主婦や子供が直感的に操作できるよう、シンプルで分かりやすいレイアウトにこだわりました。また、親子のコミュニケーションを促進する要素も重視し、楽しみながらタスクを管理できるインタラクティブなデザインを実現。視覚的なフィードバックや達成感を感じられるアニメーションを加えることで、モチベーションの向上を図りました。このプロジェクトを通じて、シンプルでありながら温かみのあるデザインが、ユーザー体験を向上させることを実感しました。',
                details: ['XDXD', 'アプリデザイン', 'UI/UXデザイン'],
                images: [
                    'images/works/actual6-1.png',
                    'images/works/actual6-2.png',
                    'images/works/actual6-3.png'
                ]
            },
            {
                id: 7,
                title: 'シマンテック - コーポレートサイト制作',
                description: '本プロジェクトでは、シマンテックのコーポレートサイトの一部を制作しました。グローバルに展開するサイバーセキュリティ企業としてのブランドイメージを大切にしながら、信頼感と先進性を感じさせるデザインを意識しました。企業サイトとしての整合性を保ちつつ、視認性や操作性の向上を考慮し、情報の整理やレイアウトの最適化を実施。細部のデザインにもこだわり、シンプルながらも洗練されたユーザー体験を提供できるよう工夫しました。シマンテックのブランド価値を支える一端を担うことができ、企業サイトのデザインにおける一貫性や信頼性の重要性を改めて実感したプロジェクトです。',
                details: ['一部デザイン', ''],
                images: [
                    'images/works/actual7-1.png',
                ]
            },
            {
                id: 8,
                title: 'F&C - 自動車出庫管理システム デザイン',
                description: 'F&Cは、高級車を対象とした出庫管理システムであり、富裕層の顧客に向けた洗練されたデザインが求められるプロジェクトでした。本システムでは、ユーザーがスムーズに車両の出庫・管理を行えるよう、機能性と視認性を両立させたUI設計を重視しました。デザイン面では、黒を基調とし、シンプルながらも高級感のあるビジュアルを採用。無駄を省いたミニマルなレイアウトと、上品なタイポグラフィ、繊細なアニメーションを取り入れることで、エレガントな印象を演出しました。また、富裕層のユーザーが直感的に操作できるよう、余白を活かした洗練されたインターフェースを設計。機能美と使いやすさを両立させることで、ストレスのないシームレスなユーザー体験を実現しました。このプロジェクトでは、ターゲットに合わせたデザインの重要性を再認識し、細部にまでこだわることで高級感を表現する手法を追求しました。',
                details: ['XD', 'UI/UXデザイン', ''],
                images: [
                    'images/works/actual8-1.png',
                    'images/works/actual8-2.png',
                ]
            },
            {
                id: 9,
                title: '株式会社ニッショー - 物件管理システム開発',
                description: '株式会社ニッショーの物件管理システム開発に初期段階から参加し、全ての管理システム画面のデザインを担当しました。不動産管理システムは多機能で複雑な設計が求められるため、直感的な操作性と分かりやすいインターフェースの実現に注力しました。特に駐車場管理システムのデザインには多くの課題があり、さまざまな要素を整理しながら最適なUI/UXを模索。ユーザーがスムーズに情報を管理できるよう、視認性や操作性を考慮し、現在も改善を続けています。 多機能でありながら、誰でも簡単に使えるシステムを目指し、細部にまでこだわったデザインを提供しました。このプロジェクトでは、機能性とユーザビリティのバランスを取る難しさを実感しながらも、使いやすいシステム作りの重要性を改めて認識しました。 ',
                details: ['Figma', 'UI/UXデザイン', '管理システムデザイン'],
                images: [
                    'images/works/actual9-1.png',
                    'images/works/actual9-2.png',
                    'images/works/actual9-3.png'
                ]
            },
        ];

        // モーダルコンテンツ領域に画像ナビゲーションを追加
        const modalContent = document.querySelector('.modal-content');
        if (modalContent) {
            // 画像ナビゲーション用のコンテナを作成
            const imgNav = document.createElement('div');
            imgNav.className = 'modal-image-nav';
            imgNav.innerHTML = `
                <button class="img-nav-prev" aria-label="前の画像"><i class="fas fa-chevron-left"></i></button>
                <div class="img-nav-indicators"></div>
                <button class="img-nav-next" aria-label="次の画像"><i class="fas fa-chevron-right"></i></button>
            `;

            // 画像の後ろに挿入
            modalImg.insertAdjacentElement('afterend', imgNav);
        }

        let currentWorkId = null;
        let currentImageIndex = 0;

        // 各作品カードにクリックイベントを追加
        workItems.forEach(item => {
            item.style.cursor = 'pointer'; // カーソルをポインターに変更

            item.addEventListener('click', function (e) {
                console.log("作品カードがクリックされました");
                e.preventDefault();
                e.stopPropagation();

                const workId = parseInt(this.getAttribute('data-id'));
                console.log("クリックされた作品ID:", workId);

                const work = workData.find(w => w.id === workId);

                if (work) {
                    console.log("作品データが見つかりました:", work.title);

                    // 現在の作品IDを保存
                    currentWorkId = workId;
                    currentImageIndex = 0;

                    // モーダルコンテンツの設定
                    updateModalContent(work, 0);

                    // モーダルを表示
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden'; // スクロール防止
                } else {
                    console.error("指定された作品IDのデータが見つかりません");
                }
            });
        });

        // モーダルコンテンツを更新する関数
        function updateModalContent(work, imageIndex) {
            // 画像を更新
            modalImg.src = work.images[imageIndex];
            modalImg.alt = `${work.title} - 画像 ${imageIndex + 1}`;

            // タイトルと説明を更新
            modalTitle.textContent = work.title;
            modalDescription.textContent = work.description;

            // 詳細タグをクリア・追加
            modalDetails.innerHTML = '';
            work.details.forEach(detail => {
                if (detail.trim() !== '') {
                    const detailElem = document.createElement('span');
                    detailElem.className = 'modal-detail';
                    detailElem.textContent = detail;
                    modalDetails.appendChild(detailElem);
                }
            });

            // 画像インジケーターを更新
            const indicators = document.querySelector('.img-nav-indicators');
            if (indicators) {
                indicators.innerHTML = '';
                work.images.forEach((img, idx) => {
                    const dot = document.createElement('span');
                    dot.className = 'img-indicator' + (idx === imageIndex ? ' active' : '');
                    dot.addEventListener('click', () => {
                        currentImageIndex = idx;
                        updateModalContent(work, idx);
                    });
                    indicators.appendChild(dot);
                });
            }
        }

        // 画像ナビゲーションボタンのイベント処理
        const prevButton = document.querySelector('.img-nav-prev');
        const nextButton = document.querySelector('.img-nav-next');

        if (prevButton) {
            prevButton.addEventListener('click', function () {
                const work = workData.find(w => w.id === currentWorkId);
                if (work) {
                    currentImageIndex = (currentImageIndex - 1 + work.images.length) % work.images.length;
                    updateModalContent(work, currentImageIndex);
                }
            });
        }

        if (nextButton) {
            nextButton.addEventListener('click', function () {
                const work = workData.find(w => w.id === currentWorkId);
                if (work) {
                    currentImageIndex = (currentImageIndex + 1) % work.images.length;
                    updateModalContent(work, currentImageIndex);
                }
            });
        }

        // 閉じるボタンの処理
        if (modalClose) {
            modalClose.addEventListener('click', function () {
                console.log("閉じるボタンがクリックされました");
                closeModal();
            });
        }

        // モーダル背景クリックで閉じる
        modal.addEventListener('click', function (event) {
            if (event.target === modal) {
                console.log("モーダル背景がクリックされました");
                closeModal();
            }
        });

        // モーダルを閉じる関数
        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // スクロール再開
            currentWorkId = null;
            currentImageIndex = 0;
        }

        // キーボードイベントの処理（画像の切り替え用）
        document.addEventListener('keydown', function (e) {
            // モーダルが開いている時のみ処理
            if (!modal.classList.contains('active')) return;

            const work = workData.find(w => w.id === currentWorkId);
            if (!work) return;

            if (e.key === 'ArrowLeft') {
                // 左矢印キー：前の画像
                currentImageIndex = (currentImageIndex - 1 + work.images.length) % work.images.length;
                updateModalContent(work, currentImageIndex);
            } else if (e.key === 'ArrowRight') {
                // 右矢印キー：次の画像
                currentImageIndex = (currentImageIndex + 1) % work.images.length;
                updateModalContent(work, currentImageIndex);
            } else if (e.key === 'Escape') {
                // ESCキー：モーダルを閉じる
                closeModal();
            }
        });
    }

    // 初期関数 - 画像遅延読み込み
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imgOptions = {
                threshold: 0,
                rootMargin: '0px 0px 200px 0px'
            };

            const imgObserver = new IntersectionObserver((entries, imgObserver) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');

                        if (src) {
                            img.src = src;
                            img.removeAttribute('data-src');
                        }

                        imgObserver.unobserve(img);
                    }
                });
            }, imgOptions);

            // 画像に遅延読み込みを適用
            const lazyImages = document.querySelectorAll('img[data-src]');
            if (lazyImages.length > 0) {
                lazyImages.forEach(img => {
                    imgObserver.observe(img);
                });
            }
        }
    }

    // 初期関数 - フォームバリデーション
    function enhanceFormValidation() {
        const contactForm = document.querySelector('.contact-form');

        if (contactForm) {
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');
            const submitBtn = document.querySelector('.form-button');

            // フィードバック要素を確保
            function ensureFeedbackElement(id, afterElement) {
                let element = document.getElementById(id);
                if (!element) {
                    console.log(`フィードバック要素 ${id} が見つからないため作成します`);
                    element = document.createElement('div');
                    element.id = id;
                    element.className = 'form-feedback';
                    afterElement.parentNode.insertBefore(element, afterElement.nextSibling);
                }
                return element;
            }

            const feedbacks = {
                name: ensureFeedbackElement('name-feedback', nameInput),
                email: ensureFeedbackElement('email-feedback', emailInput),
                subject: ensureFeedbackElement('subject-feedback', subjectInput),
                message: ensureFeedbackElement('message-feedback', messageInput)
            };

            // 入力フィールドの検証関数
            function validateInput(input, feedback, message, condition) {
                if (condition) {
                    input.classList.remove('invalid');
                    input.classList.add('valid');
                    feedback.textContent = '';
                    feedback.classList.remove('active');
                    return true;
                } else {
                    input.classList.remove('valid');
                    input.classList.add('invalid');
                    feedback.textContent = message;
                    feedback.classList.add('active');
                    return false;
                }
            }

            // メールアドレスの検証関数
            function validateEmail(email) {
                const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return re.test(email);
            }

            // フォーム送信時の検証
            contactForm.addEventListener('submit', function (e) {
                // 一時的にデフォルト動作を停止（バリデーション実行のため）
                e.preventDefault();

                // 送信ボタンの状態変更
                const originalBtnText = submitBtn.textContent;
                submitBtn.textContent = '送信中...';
                submitBtn.disabled = true;

                // 各フィールドの検証
                const isNameValid = validateInput(
                    nameInput,
                    feedbacks.name,
                    'お名前を入力してください',
                    nameInput.value.trim() !== ''
                );

                const isEmailValid = validateInput(
                    emailInput,
                    feedbacks.email,
                    '有効なメールアドレスを入力してください',
                    validateEmail(emailInput.value.trim())
                );

                const isSubjectValid = validateInput(
                    subjectInput,
                    feedbacks.subject,
                    '件名を入力してください',
                    subjectInput.value.trim() !== ''
                );

                const isMessageValid = validateInput(
                    messageInput,
                    feedbacks.message,
                    'メッセージを入力してください',
                    messageInput.value.trim() !== ''
                );

                // すべて有効な場合のみフォームを送信
                if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
                    console.log("フォームバリデーション成功 - Formspreeに送信します");
                    
                    // ここで実際にフォームを送信
                    contactForm.submit();
                    
                    // 注意: submit()メソッドを使用するため、このあとのコードは実行されない可能性があります
                } else {
                    // バリデーション失敗時はボタンを元に戻す
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                    console.log("フォームバリデーション失敗");
                }
            });

            // 入力中のリアルタイム検証
            nameInput.addEventListener('blur', function () {
                validateInput(this, feedbacks.name, 'お名前を入力してください', this.value.trim() !== '');
            });

            emailInput.addEventListener('blur', function () {
                validateInput(this, feedbacks.email, '有効なメールアドレスを入力してください', validateEmail(this.value.trim()));
            });

            subjectInput.addEventListener('blur', function () {
                validateInput(this, feedbacks.subject, '件名を入力してください', this.value.trim() !== '');
            });

            messageInput.addEventListener('blur', function () {
                validateInput(this, feedbacks.message, 'メッセージを入力してください', this.value.trim() !== '');
            });
        }
    }

    // 初期関数 - 封筒の視差効果
    function initEnvelopeEffect() {
        const envelopeContainer = document.querySelector('.envelope-container');
        const envelopeImg = document.querySelector('.envelope-img');

        if (envelopeContainer && envelopeImg) {
            document.addEventListener('mousemove', function(e) {
                let moveX = (e.clientX / window.innerWidth - 0.5) * 20;
                let moveY = (e.clientY / window.innerHeight - 0.5) * 20;
                
                envelopeContainer.style.transform = `rotate(-5deg) translate(${moveX}px, ${moveY}px)`;
            });
        }
    }
});
