

$(document).ready(() => {

    if (document.getElementsByClassName('carousel-container').length > 0) {

        var couponsCarousel = $('.carousel-container');
        console.log('here', document.getElementsByClassName('carousel-container'));
        couponsCarousel

            .slick({

                dots: false,

                infinite: false,

                slidesToShow: 8,

                cssEase: 'linear',

                speed: 300,

                centerMode: false,

                mobileFirst: true,

                accessibility: true,

                arrows: true,

                variableWidth: true,

                variableHeight: true,

                responsive: [{

                    breakpoint: 1440,

                    settings: {

                        slidesToShow: 7,

                    }

                }, {

                    breakpoint: 1096,

                    settings: {

                        slidesToShow: 6,

                    }

                }, {

                    breakpoint: 986,

                    settings: {

                        slidesToShow: 5,

                    }

                }, {

                    breakpoint: 810,

                    settings: {

                        slidesToShow: 4,

                    }

                }, {

                    breakpoint: 600,

                    settings: {

                        slidesToShow: 3,

                    }

                }, {

                    breakpoint: 420,

                    settings: {

                        slidesToShow: 2,

                    }

                }, {

                    breakpoint: 320,

                    settings: {

                        slidesToShow: 1,

                    }

                }]
            })

        couponsCarousel.slick('slickRemove', false);

    }

}
)

$(".slick-track").css("max-width", $(window).width());
