<?php
namespace Deployer;

require 'recipe/common.php';

// Project name
set('application', 'mia');

// Project repository
set('repository', 'git@github.com:torreycommerce/mia.git');

// [Optional] Allocate tty for git clone. Default value is false.
set('git_tty', true); 

// Set HTTP user
set('http_user', 'www-data');

// Shared files/dirs between deploys 
set('shared_files', []);
set('shared_dirs', []);

// Writable dirs by web server 
set('writable_dirs', []);


// Hosts

// Hosts
inventory('hosts.yml');

// Tasks
desc('Delete unneeded deploy files');
task('update:cleanup', function () {
  run('rm -rf {{release_path}}/hosts.yml {{release_path}}/deploy.php {{release_path}}/azure-pipelines.yml {{release_path}}/composer.json {{release_path}}/composer.lock {{release_path}}/vendor');
})->desc('Delete unneeded deploy files');

desc('Create live site symlink');
task('update:symlink', function () {
  run('sudo ln -nsf {{release_path}} /var/www/themes/mia');
})->desc('Updating live site symlink');

desc('Deploy your project');
task('deploy', [
    'deploy:info',
    'deploy:prepare',
    'deploy:lock',
    'deploy:release',
    'deploy:update_code',
    'deploy:shared',
    'deploy:writable',
    'deploy:vendors',
    'deploy:clear_paths',
    'deploy:symlink',
    'deploy:unlock',
    'cleanup',
    'success'
]);

// After deploy, update symlink
after('deploy:symlink', 'update:cleanup');
after('deploy:symlink', 'update:symlink');

// [Optional] If deploy fails automatically unlock.
after('deploy:failed', 'deploy:unlock');
