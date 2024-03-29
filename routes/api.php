<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
Auth::routes(['verify' => true]);

Route::group(['middleware' => 'auth:api'], function () {
    Route::post('logout', 'Auth\LoginController@logout');

    // Route::get('/user', 'Auth\UserController@current');

    Route::patch('settings/profile', 'Settings\ProfileController@update');
    Route::patch('settings/password', 'Settings\PasswordController@update');
});

Route::group(['middleware' => 'guest:api'], function () {
    Route::post('login', 'Auth\LoginController@login');
    Route::post('register', 'Auth\RegisterController@register');

    Route::post('password/email', 'Auth\ForgotPasswordController@sendResetLinkEmail');
    Route::post('password/reset', 'Auth\ResetPasswordController@reset');

    Route::post('email/verify/{user}', 'Auth\VerificationController@verify')->name('verification.verify');
    Route::post('email/resend', 'Auth\VerificationController@resend');

    Route::post('oauth/{driver}', 'Auth\OAuthController@redirectToProvider');
    Route::get('oauth/{driver}/callback', 'Auth\OAuthController@handleProviderCallback')->name('oauth.callback');
});
// Route::group(['prefix' => 'employe'], function(){})
Route::get('/user', 'Auth\UserController@current');
Route::get('employe', 'EmployeController@index');
Route::post('employe', 'EmployeController@store');
Route::get('employe/affichage', 'EmployeController@affichage');
Route::get('employe/faces', 'EmployeController@faces');
Route::get('employe/create', 'EmployeController@create');
Route::get('employe/{id}/edit', 'EmployeController@edit');
Route::patch('employe/{id}', 'EmployeController@update');
Route::delete('employe/{id}', 'EmployeController@destroy');

Route::get('departement', 'DepartementController@index');
Route::get('departement/{id}/employes', 'DepartementController@employes');
Route::get('departement/{id}/edit', 'DepartementController@edit');
Route::get('departement/affichage', 'DepartementController@affichage');
Route::post('departement', 'DepartementController@store');
